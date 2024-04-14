import { Link, Outlet, useNavigate } from "react-router-dom";
import styles from "./nav.module.css";
import { useAuthContext } from "../../AuthProvider";

import { getAuth, signOut } from "firebase/auth";

const Nav = () => {

    const {user,setUser} = useAuthContext();
    const navigate = useNavigate();

    const logOut = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
          // Sign-out successful.
          console.log("Sign-out successful");
          setUser({});
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