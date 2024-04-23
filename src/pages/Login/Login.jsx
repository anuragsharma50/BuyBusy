import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import styles from "./login.module.css";
import { useState } from "react";
import { useDispatch, } from "react-redux";
import { authActions } from "../../redux/reducers/AuthReducer";

const Login = () => {

    const dispath = useDispatch();
    const navigate = useNavigate();

    const [userData,setUserData] = useState({email:"",password:""});
    const [error,setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // checking if email is vaild
        let vaildEmail = (/^\S+@\S+\.\S+$/).test(userData.email);
        if(!vaildEmail){
            setError("Invaild email address")
            return;
        }

        if(userData.password.length < 8){
            setError("Password should have atleast 8 characters");
            return;
        }

        const auth = getAuth();
        signInWithEmailAndPassword(auth, userData.email, userData.password)
        .then((userCredential) => {
            // Signed up 
            console.log("Registered");
            console.log(userCredential);
            dispath(authActions.addInitialState({email:userCredential.user.email,id:userCredential.user.uid}));
            setUserData({name:"",email:"",password:""});
            navigate("/");
        })
        .catch((error) => {
            // setting error based on firebase response
            setError(error.message.slice(22,-2).split("-").join(" "))
            console.log(error.message)
        });
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Welcome Back</h1>
            <p className={styles.subHeading}>Enter your email and password to access your account</p>
            <form onSubmit={(e) => handleSubmit(e)} className={styles.inputs}>
            <label htmlFor="email">Email</label>
                <input className={styles.tinput} type="email" placeholder="Enter your email" id="email" onChange={(e) => setUserData({...userData,email:e.target.value})} value={userData.email} required />
                <label htmlFor="password">Password</label> 
                <input className={styles.tinput} type="password" placeholder="Enter your password" id="password" onChange={(e) => setUserData({...userData,password:e.target.value})} value={userData.password} required />
                { error && <p style={{color:"red",fontWeight:"bold"}}>{error}</p>}
                <button type="submit" className={styles.btn}>Login</button>
            </form>
            <p className={styles.signupLink}>Don't have an Account?<Link to="/register">Register Here</Link></p>
        </div>
    )
}

export default Login;