import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthProvider";

import { addDoc, collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore"; 
import { db } from "./firebaseInit";

export const cartContext = createContext();

export const useCartContext = () => {
    const values = useContext(cartContext);
    return values;
}

export const ItemsProvider = ({children}) => {

    const [cart,setCart] = useState([]);
    const [orders,setOrders] = useState([]);
    const {user} = useAuthContext();

    useEffect(() => {
        if(user.id){
            // fetch cart items from db
            getDocs(collection(db, "buybusy", user.id,"cart"))
            .then(querySnapshot => {
                const cartDataFromDB = querySnapshot.docs.map((doc) => {
                    return {
                        dbId:doc.id,
                        ...doc.data()
                    }
                })
                setCart(cartDataFromDB);
            })
            .catch(err => {
                console.log("error while fetching cart items")
                console.log(err);
            })

            getDocs(collection(db, "buybusy", user.id,"order"))
            .then(querySnapshot => {
                const ordersDataFromDB = querySnapshot.docs.map((doc) => {
                    return {
                        dbId:doc.id,
                        ...doc.data()
                    }
                })
                // console.log(ordersDataFromDB);
                setOrders(ordersDataFromDB);
            })
            .catch(err => {
                console.log("error while fetching cart items")
                console.log(err);
            })
        }
    },[user]);

    const addItemToDB = async (item) => {
        try {
            const cartRef = collection(db, "buybusy", user.id,"cart");
            const res = await addDoc(cartRef, {
                ...item
            });
            console.log(res.id);
            return res.id;
        } catch (err) {
            console.log(err);
        }
    }

    const updateItemToDB = async (item) => {
        try {
            const cartRef = doc(db, "buybusy", user.id,"cart",item.dbId);
            await updateDoc(cartRef, {
                ...item
            });
        } catch (err) {
            console.log(err);
        }
    }

    const deleteItemFromDB = async (item) => {
        try {
            await deleteDoc(doc(db, "buybusy", user.id,"cart",item.dbId));
        } catch (err) {
            console.log(err);
        }
    }

    const addItemToCart = async (item) => {
        
        const index = cart.findIndex(c => c.id === item.id);
        if(index === -1) {
            item.quantity = 1;
            console.log(user);
            let dbId = await addItemToDB(item);
            if(dbId){
                item.dbId = dbId;
                setCart([...cart,item]);
            }
            else{
                // show error
            }
        }
        else{
            cart[index].quantity += 1;
            updateItemToDB(cart[index]);
            setCart(cart);
        }
    }

    const removeFromCart = (id) => {
        let item = cart.find(c => c.id === id);
        deleteItemFromDB(item);
        let updatedCart = cart.filter(c => c.id !== id);
        setCart(updatedCart);
    }

    const updateQuantity = (id, count) => {
        const index = cart.findIndex(c => c.id === id);
        if(index !== -1){
            if(cart[index].quantity+count <= 0) {
                removeFromCart(id);
            }
            else{
                cart[index].quantity += count;
                updateItemToDB(cart[index]);
                setCart([...cart]);
            }
        }
    }

    // Order 
    const addOrderToDB = async (order) => {
        try {
            const cartRef = collection(db, "buybusy", user.id,"order");
            const res = await addDoc(cartRef, {
                ...order
            });
            console.log(res.id);
            return res.id;
        } catch (err) {
            console.log(err);
        }
    }

    const purchase = async () => {
        const sum = cart.reduce((total,c) => {
            return total += c.price * c.quantity;
        },0);

        let items = cart.map(c => {
            return {
                title: c.title,
                price: c.price,
                quantity: c.quantity,
                total: c.price*c.quantity
            }
        })

        let order = {
            date: new Date().toISOString(),
            total: sum,
            items
        };

        const res = await addOrderToDB(order);
        order.dbId = res;
        setOrders([order, ...orders]);

        // clear cart from db
        cart.forEach(async (c) => {
            console.log(c);
            await deleteDoc(doc(db, 'buybusy',user.id,"cart",c.dbId));
        })

        setCart([]);
    }

    return(
        <cartContext.Provider value={{cart,addItemToCart,removeFromCart,updateQuantity,purchase,orders}}>
            {children}
        </cartContext.Provider>
    )
}

