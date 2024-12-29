import { type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "../user/userSlice"
import type { LoginCredentials } from "../../pages/Login"
import { createAppSlice } from "../../app/createAppSlice"
import { fetchLogin, fetchLogout } from "./sessionAPI"

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
      async (credentials: LoginCredentials) => await fetchLogin(credentials),
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
          state.error =
            action.error.message?.toString() ||
            "An unexpected error occurred. Please try again."
          state.isAuthenticated = false
        },
      },
    ),
    logoutAsync: create.asyncThunk(async () => await fetchLogout(), {
      pending: state => {
        state.status = "loading"
        state.error = null
      },
      fulfilled: state => {
        state.status = "idle"
        state.user = null
        state.isAuthenticated = false
      },
      rejected: (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      },
    }),
  }),
})

export const { setSession, removeSession, loginAsync, logoutAsync } =
  sessionSlice.actions
