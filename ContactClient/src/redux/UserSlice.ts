import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const persistedUser = JSON.parse(localStorage.getItem("user") || "null");
const persistedDarkmode = JSON.parse(localStorage.getItem("darkmode") || "false");

interface UserState {
    login: boolean;
    darkmode: boolean;
    userID: null|string ;
    userName:string|null|undefined;
}


const initialState: UserState = {
    login: persistedUser?.login || false,
    userID: persistedUser?.userID || null,
    darkmode: persistedDarkmode,
    userName:persistedUser?.userName|| null
};



export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginStatus: (state, action: PayloadAction<boolean>) => {
            state.login = action.payload;
        },
        login: (state, action: PayloadAction<UserState>) => {
            state.login = action.payload.login;
            state.userID = action.payload.userID;
            state.userName = action.payload.userName;
            localStorage.setItem("user", JSON.stringify({
                login: state.login,
                userID: state.userID,
                userName:state.userName
            }));
        },
        logout: (state) => {
            state.login = false;
            state.userID =null;
            state.userName=null;
            localStorage.removeItem("user");
            console.log("Call");
            
        },        
        darkmodeStatus: (state, action: PayloadAction<boolean>) => {
            state.darkmode = action.payload;
        },
    },
});

export const { loginStatus, darkmodeStatus,login,logout } = UserSlice.actions;

export default UserSlice.reducer;
