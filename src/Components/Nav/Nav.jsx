import { Link, Outlet, useNavigate } from "react-router-dom";
import "./nav.module.css";

import { getAuth, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authSelector, getInitialAuthState } from "../../redux/reducers/AuthReducer";
import { getInitialCartState } from "../../redux/reducers/cartReducer";
import { useEffect } from "react";

const Nav = () => {
    
    const navigate = useNavigate();

    const {user} = useSelector(authSelector);
    const dispatch = useDispatch();

    // fetching cart and auth state here.
    // fetching cart here as we are using it in both home and cart component
    // fetching auth as we are using it everywhere
    useEffect(() => {
        console.log(user);
        if(user.id){
            dispatch(getInitialCartState({userId: user.id}));
        }
        else{
            dispatch(getInitialAuthState());
        }
    },[user,dispatch]);

    // dispatching logout action and naving user to homepage
    const logOut = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
          // Sign-out successful.
          console.log("Sign-out successful");
          dispatch(authActions.logout()); 
          navigate("/");
        }).catch((error) => {
          // An error happened.
          console.log("Error: ", error);
        });
    }
 
    return (
        <div>
            <nav>
                <Link to="/"><h2>BuyBusy</h2></Link>
                <Link to="/" style={{marginLeft:"auto"}}><h3>Home</h3></Link>
                {
                    user.email ? 
                    <>
                        <Link to="/orders"><h3>Orders</h3></Link>
                        <Link to="/cart"><h3>Cart</h3></Link>
                        <Link onClick={logOut}><h3>LogOut</h3></Link>
                    </>
                    : <Link to="/login"><h3>Login</h3></Link>
                }
                
            </nav>
            <Outlet />
        </div>
    )
}

export default Nav;