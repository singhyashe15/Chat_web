import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  _id : "",
  name : "",
  email : "",
  profile_pic : "",
  quotes:"",
  token : "",
  login:false,
  onlineUser : [],
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser : (state,action)=>{
        state._id = action.payload._id
        state.name = action.payload.name 
        state.email = action.payload.email 
        state.profile_pic = action.payload.profile_pic 
        state.quotes = action.payload.quotes
    },
    setToken : (state,action)=>{
        state.token = action.payload
    },
    logout : (state,action)=>{
        state._id = ""
        state.name = ""
        state.email = ""
        state.profile_pic = ""
        state.token = ""

    },
    setOnlineUser : (state,action)=>{
      state.onlineUser = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUser, setToken ,logout,setLogin, setOnlineUser,setSocketConnection } = userSlice.actions

export default userSlice.reducer