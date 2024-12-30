// import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
  name: string
  email: string
  password: string
}

// interface UserState {
//   user: User | null
// }

// const initialState: UserState = {
//   user: null,
// }

// // TODO load all users

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<User>) => {
//       state.user = action.payload
//     },
//     clearUser: state => {
//       state.user = null
//     },
//   },
// })

// export const { setUser, clearUser } = userSlice.actions
// export default userSlice.reducer
