import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        accessToken: null,
        email: null
    });

    const setAuthInfo = ({ accessToken }, email) => {
        setAuth({
            isAuthenticated: !!accessToken,
            accessToken,
            email
        });
    };
    const [persist ,setPersist] =useState(
          localStorage.getItem("persist")=="undefined" ?true :JSON.parse(localStorage.getItem("persist")));

    return (
        <AuthContext.Provider value={{ auth,setAuth,setAuthInfo, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
