import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    login: boolean;
    darkmode: boolean;
}
const initialState:UserState = {
    login: false,
    darkmode: false,
};

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginStatus: (state, action:PayloadAction<boolean>) => {
            state.login = action.payload;
        },
        darkmodeStatus: (state, action:PayloadAction<boolean>) => {
            state.darkmode = action.payload;
        },
    },
});

export const { loginStatus,darkmodeStatus } = UserSlice.actions;

export default UserSlice.reducer;
