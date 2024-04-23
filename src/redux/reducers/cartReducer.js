import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseInit";

// create initial state
const INITIAL_STATE = {
    cart: [],
    error: ""
};

// async thunk to get cart from db if anything is already there, using on Nav component
export const getInitialCartState = createAsyncThunk(
    'cart/getInitialCartState', async (payload) => {
        
        const querySnapshot = await getDocs(collection(db, "buybusy", payload.userId,"cart"))
            const cartDataFromDB = querySnapshot.docs.map((doc) => {
                return {
                    dbId:doc.id,
                    ...doc.data()
                }
            })
            return cartDataFromDB;
    }
)

// adding new item to cart and DB
export const addItemToDB = createAsyncThunk(
    'cart/addItemToDB', async (payload,thunkAPI) => {
        try {
            const cartRef = collection(db, "buybusy", payload.user.id,"cart");
            const res = await addDoc(cartRef, {
                ...payload.item
            });
            payload.item.dbId = res.id;
            return payload.item;
        } catch (err) {
            console.log(err);
        }
    }
)

// upadting existing item to cart and DB
export const updateItemToDB = createAsyncThunk(
    'cart/updateItemToDB', async (payload,thunkAPI) => {
        console.log("update item called");
        try {
            const cartRef = doc(db, "buybusy", payload.user.id,"cart", payload.item.dbId);
            await updateDoc(cartRef, {
                ...payload.item
            });
            return payload.item;
        } catch (err) {
            console.log(err);
        }
    }
)

// deleting cart item from DB
export const deleteItemFromDB = createAsyncThunk(
    'cart/deleteItemFromDB', async (payload,thunkAPI) => {
        try {
            await deleteDoc(doc(db, "buybusy", payload.user.id,"cart",payload.item.dbId));
            console.log(payload);
            return payload.item;
        } catch (err) {
            console.log(err);
        }
    }
)


// clearing cart when user click on purchase
export const clearCart = createAsyncThunk(
    'cart/clearCart', async (payload) => {
        payload.cart.forEach(async (c) => {
            await deleteDoc(doc(db, 'buybusy',payload.user.id,"cart",c.dbId));
        })
        return;
    }
)

// create slice, no reducers are used all extra reducers are called based on asyncThunk actions
export const cartSlice = createSlice({
    name: 'cart',
    initialState: INITIAL_STATE,
    reducers: {

    },
    extraReducers: builder => {
        builder.addCase(getInitialCartState.fulfilled,(state,action) => {
            console.log("getInitial state for cart called");
            console.log(action.payload);
            state.cart = action.payload;
        })
        .addCase(addItemToDB.fulfilled,(state,action) => {
            let item = action.payload;
            state.cart = [...state.cart,item];
        })
        .addCase(updateItemToDB.fulfilled,(state,action) => {
            state.cart[action.meta.arg.index] = action.payload;
        })
        .addCase(deleteItemFromDB.fulfilled, (state,action) => {
            console.log(action.payload);
            const index = state.cart.findIndex(c => c.dbId === action.payload.dbId);
            console.log(index);
            state.cart.splice(index,1);
        })
        .addCase(clearCart.fulfilled,(state,action) => {
            state.cart = [];
        })
    }
})

export const cartReducer = cartSlice.reducer;
export const cartActions = cartSlice.actions;
export const cartSelector = (state) => state.cartReducer;