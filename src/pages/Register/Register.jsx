import { Link, useNavigate } from "react-router-dom";
import styles from "./register.module.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

import { useAuthContext } from "../../AuthProvider.jsx";

const Register = () => {

    const {setUser} = useAuthContext();
    const navigate = useNavigate();

    const [userData,setUserData] = useState({name:"",email:"",password:""});
    const [error,setError] = useState("");

    const registerUserToDb = (e,email,password) => {
        e.preventDefault();

        // checking if email is vaild
        let vaildEmail = (/^\S+@\S+\.\S+$/).test(email);
        if(!vaildEmail){
            setError("Invaild email address")
            return;
        }

        if(password.length < 8){
            setError("Password should have atleast 8 characters");
            return;
        }

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            console.log("Registered");
            console.log(userCredential);
            // const user = userCredential.user;
            setUser({email:userCredential.user.email,id:userCredential.user.uid});
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
            <h1 className={styles.heading}>Create Account</h1>
            <p className={styles.subHeading}>Please enter your details to create an account</p>
            <form className={styles.inputs} onSubmit={(e) => registerUserToDb(e,userData.email,userData.password)}>
                <label htmlFor="name">Name</label>
                <input className={styles.tinput} type="text" placeholder="Enter your name" id="name" onChange={(e) => setUserData({...userData,name:e.target.value})} value={userData.name} />
                <label htmlFor="email">Email</label>
                <input className={styles.tinput} type="email" placeholder="Enter your email" id="email" onChange={(e) => setUserData({...userData,email:e.target.value})} value={userData.email} required />
                <label htmlFor="password">Password</label> 
                <input className={styles.tinput} type="password" placeholder="Enter your password" id="password" onChange={(e) => setUserData({...userData,password:e.target.value})} value={userData.password} required />
                { error && <p style={{color:"red",fontWeight:"bold"}}>{error}</p>}
                <button type="submit" className={styles.btn}>Login</button>
            </form>
            <p className={styles.signupLink}>Already have an Account?<Link to="/login">LogIn</Link></p>
        </div>
    )
}

export default Register;