import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const authContext = createContext();

export const useAuthContext = () => {
    const values = useContext(authContext);
    return values;
}

export const AuthProvider = ({children}) => {

    const [user,setUser] = useState({});

    useEffect(() => {

        const auth = getAuth();
        onAuthStateChanged(auth, (userCredential) => {
        if (userCredential) {
            setUser({email:userCredential.email,id:userCredential.uid});
        } else {
            // User is signed out
            console.log("not signed in");
        }
        });
    },[]);

    return (
        <authContext.Provider value={{user,setUser}}>
            {children}
        </authContext.Provider>
    )

}