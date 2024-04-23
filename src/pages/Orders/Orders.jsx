import { useDispatch, useSelector } from "react-redux";

import styles from "./orders.module.css";
import { getInitialOrderState, orderSelector } from "../../redux/reducers/orderReducer";
import { authSelector } from "../../redux/reducers/AuthReducer";
import { useEffect } from "react";

const Orders = () => {

    const {orders} = useSelector(orderSelector);
    const {user} = useSelector(authSelector);
    const dispatch = useDispatch();

    // dispatching action for fetching orders from DB
    useEffect(() => {
        if(user.id){
            dispatch(getInitialOrderState({userId: user.id}));
        }
    },[user,dispatch]);

    return (
        <div>
            <h1 className="heading">Your Orders</h1>
            <div className={styles.orders}>
                {orders.map((order,i) => {
                    return (
                        <div className={styles.order} key={i}>
                            <h3 style={{textAlign:"center",color:"gray",padding:"8px"}}>Ordered On: {new Date(order.date).getDate() + "-" + new Date(order.date).getMonth() + "-" + (new Date(order.date).getYear()-100)}</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        order.items.map((item,i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{item.title}</td>
                                                    <td>{item.price}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>&#8377;{item.total}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>&#8377;{order.total}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Orders;