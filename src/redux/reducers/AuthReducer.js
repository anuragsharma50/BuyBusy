import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getAuth, onAuthStateChanged } from "firebase/auth";


const initialAuthState = {
    user: {}
}

// fetching auth state - call when user login, register or refresh the page
export const getInitialAuthState = createAsyncThunk(
    'auth/getInitialAuthState', async (payload,thunkAPI) => {
        const auth = getAuth();
        onAuthStateChanged(auth, (userCredential) => {
            if (userCredential) {
                console.log(userCredential);
                thunkAPI.dispatch(authActions.addInitialState({email:userCredential.email,id:userCredential.uid}));
            } else {
                // User is signed out
                console.log("not signed in");
            }     
        });
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        addInitialState: (state,action) => {
            console.log(action);
            state.user = action.payload;
        },
        // logout action to clear state.
        logout: (state,action) => {
            state.user = {};
        }
    }
})

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
export const authSelector = (state) => state.authReducer;
