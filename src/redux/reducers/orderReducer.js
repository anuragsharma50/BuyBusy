import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseInit";

const initialOrderState = {
    orders: []
}

// To add a order to DB, called from Cart page
export const addOrderToDB = createAsyncThunk(
    'orders/addOrderToDB', async (payload) => {
        try {
            const cartRef = collection(db, "buybusy", payload.user.id,"order");
            const res = await addDoc(cartRef, {
                ...payload.order
            });
            payload.order.dbId = res.id;
            return payload.order;
        } catch (err) {
            console.log(err);
        }
    }
)

// To get orders list, will be used in order page
export const getInitialOrderState = createAsyncThunk(
    'orders/getInitialOrderState', async (payload) =>{
        const querySnapshot = await getDocs(collection(db, "buybusy", payload.userId,"order"))
        const orderDataFromDB = querySnapshot.docs.map((doc) => {
            return {
                dbId:doc.id,
                ...doc.data()
            }
        })
        return orderDataFromDB;
    }
)

// Only extrareducers are created as we are only performing async tasks
const orderSlice = createSlice({
    name: "orders",
    initialState: initialOrderState,
    reducers: {

    },
    extraReducers: builder => {
        builder.addCase(addOrderToDB.fulfilled,(state,action) => {
            state.orders.push(action.payload);
        })
        .addCase(getInitialOrderState.fulfilled, (state,action) => {
            state.orders = action.payload;
        })
    }
})

export const orderReducer = orderSlice.reducer;
export const orderActions = orderSlice.actions;
export const orderSelector = (state) => state.orderReducer;