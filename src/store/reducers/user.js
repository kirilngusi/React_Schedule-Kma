import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../utilities/typeContains";
import setAuthToken from "../../utilities/setAuthToken";

export const login = createAsyncThunk("user/login", async (formLogin) => {
    const headers = {
        "Content-Type": "application/json",
    };

    const res = await axios.post(`${apiUrl}/login`, formLogin, { headers });
    // console.log(res);
    return res.data;
});

// export const getShedule = createAsyncThunk("user/getShedule", async () => {
//     const headers = {
//         "Content-Type": "application/json",
//     };
//     if (localStorage.getItem("token")) {
//         setAuthToken(localStorage.getItem("token"));
//     }

//     const res = await axios.get(`${apiUrl}`, { headers });
//     return res;
// });

export const authUser = createAsyncThunk("user/AuthUser", async () => {
    const headers = {
        "Content-Type": "application/json",
    };
    if (localStorage.getItem("token")) {
        setAuthToken(localStorage.getItem("token"));
    }

    const res = await axios.get(`${apiUrl}`, { headers });
    return res;
});

export const slice = createSlice({
    name: "user",
    initialState: {
        logged: false,
        userInfo: "",
        shedule: "",
        authLoading: true,
        error: "",
    },
    reducers: {
        setLogin(state, action) {
            state.logged = true;
        },
        setLogout(state, action) {
            state.logged = false;
            localStorage.removeItem("token");
            localStorage.removeItem("data");
        },
        setError(state, action) {
            state.error = action.payload;
        },
    },
    extraReducers: {
        [login.pending]: (state, action) => {
            console.log("Pending");
            state.authLoading = false;
        },
        [login.fulfilled]: (state, action) => {
            // state.data = action.payload;
            state.logged = true;
            state.authLoading = true;

            state.userInfo = action.payload.message.student_id;

            localStorage.setItem("token", action.payload.accessToken);
            localStorage.setItem(
                "data",
                JSON.stringify(action.payload.message.fullInfo.schedule)
            );
        },
        [login.rejected]: (state, action) => {
            state.authLoading = true;
            state.logged = false;
            localStorage.removeItem("token");
            localStorage.removeItem("data");
            state.error = "Sai Tài Khoản Hoặc Mật Khẩu";
        },

        [authUser.pending]: (state, action) => {
            console.log("Pending");
            state.authLoading = false;
        },
        [authUser.fulfilled]: (state, action) => {
            state.logged = true;
            state.authLoading = true;
            state.userInfo = action.payload.data.student_id;
        },
        [authUser.rejected]: (state, action) => {
            state.logged = false;
            state.authLoading = true;
            localStorage.removeItem("token");
            localStorage.removeItem("data");
            // state.error = action.payload;
        },

        // [getShedule.pending]: (state, action) => {
        //     console.log("Pending getshedule");
        // },
        // [getShedule.fulfilled]: (state, { payload }) => {
        //     state.shedule = payload.data.message.schedule;

        //     localStorage.setItem(
        //         "data",
        //         JSON.stringify(payload.data.message.schedule)
        //     );
        // },
    },
});

export const { setLogin, setLogout, setError } = slice.actions;

// export const selecteShedule = (state) => state.user.shedule;

const userReducer = slice.reducer;
export default userReducer;
