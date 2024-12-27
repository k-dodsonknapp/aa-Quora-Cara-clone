import { type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "../user/userSlice"
import type { LoginCredentials } from "../../pages/Login"
import { createAppSlice } from "../../app/createAppSlice"
import { fetchLogin } from "./sessionAPI"
import { csrfFetch } from "../csrf/csrf"

interface SessionState {
  user: User | null
  isAuthenticated: boolean
  status: "idle" | "loading" | "failed"
  error: string | null
}

const initialState: SessionState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
}

export const sessionSlice = createAppSlice({
  name: "session",
  initialState,
  reducers: create => ({
    setSession: create.reducer(
      (state, action: PayloadAction<{ user: User }>) => {
        state.user = action.payload.user
        state.isAuthenticated = true
      },
    ),
    removeSession: create.reducer(state => {
      state.isAuthenticated = false
      state.user = null
    }),
    loginAsync: create.asyncThunk(
      async (credentials: LoginCredentials) => {
        // const response = await fetchLogin(credentials)
        // return response

        const response = await csrfFetch("http://localhost:8080/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`Login failed. Status code: ${response.status}`)
        }

        const data = await response.json()
        return data.user
      },
      {
        pending: state => {
          state.status = "loading"
          state.error = null
        },
        fulfilled: (state, action) => {
          state.status = "idle"
          state.user = action.payload
          state.isAuthenticated = true
        },
        rejected: (state, action) => {
          state.status = "failed"
          state.error = action.payload as string
        },
      },
    ),
  }),
})

export const { setSession, removeSession, loginAsync } = sessionSlice.actions
