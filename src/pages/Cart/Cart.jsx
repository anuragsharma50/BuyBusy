import { useEffect, useState } from "react";
import { useCartContext } from "../../ItemsProvider";
import styles from "./cart.module.css";

const Cart = () => {

    const {cart,removeFromCart,updateQuantity,purchase} = useCartContext();

    const [total,setTotal] = useState(0);

    // console.log(cart);

    useEffect(() => {
        const sum = cart.reduce((total,c) => {
            return total += c.price * c.quantity;
        },0)
        setTotal(sum);
    },[cart])

    return (
        <div>
            <h1 className="heading">Cart</h1>
            {
                cart.length <= 0 
                ?
                    <h2 style={{textAlign:"center"}}>Cart is Empty</h2>
                :
                    <div className={styles.container}>
                        <div className={styles.total}>
                            <h2>Total : &#8377;{total}</h2>
                            <button onClick={purchase} className={styles.purchaseBtn}>Purchase</button>
                        </div>
                        <div className={styles.cards}>
                            {cart.map(c => {
                                return (
                                    <div className={styles.card} key={c.id}>
                                        <img className={styles.cardImg} src={c.image} alt={c.title} />
                                        <h3 className={styles.cardTitle}>{c.title.slice(0,30)}...</h3>
                                        <div className={styles.priceQuantity}>
                                            <h2>&#8377;{c.price}</h2>
                                            <span className={styles.updateButtons}>
                                                <img onClick={() => updateQuantity(c.id,-1)} className={styles.updateBtn} src="https://img.icons8.com/ios-filled/50/FFFFFF/minus-math.png" alt="minus-math"/>
                                                <span className={styles.count}>{c.quantity}</span>
                                                <img onClick={() => updateQuantity(c.id,1)}  className={styles.updateBtn} src="https://img.icons8.com/ios-filled/50/FFFFFF/plus-math.png" alt="plus-math"/>
                                            </span>
                                        </div>
                                        <button onClick={() => removeFromCart(c.id)} className={`${styles.cardButton} ${styles.removeButton}`}>Remove from cart</button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
            }
        </div>
    )
}

export default Cart;