import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { SessionContext } from "Components/SessionContext";
import Login from "Routes/Login/Login";
import Register from "Routes/Register/Register";
import ResetPassword from "Routes/ResetPassword/ResetPassword";
import MapRoute from "Routes/MapRoute/MapRoute";
import UserProfileRoute from "Routes/UserProfile/UserProfile";
import {
    setSessionFromToken,
    getStoredSession,
    removeStoredSession,
    getSessionCookie,
    setSessionCookie,
    removeSessionCookie,
    confirmAuthentication,
    getSessionIfPresent,
} from "utils/helperfuncs";
import "./App.scss";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => confirmAuthentication());
    const [session, setSession] = useState(() => getSessionIfPresent());
    const history = useHistory();

    // 1) just loaded page -> (not authenticated, no session, no session cookie, no token) -> do nothing
    // 2) cookie expired   -> (authenticated, session, session cookie, no token) ->
    // 3) page reload      -> (not authenticated, no session, session cookie, token)

    const logIn = () => {
        // setSessionCookie();
        // setSession(() => getSessionCookie());
        console.log("logging in");
        setSession(() => getStoredSession());
        setIsAuthenticated(true);
        history.push("/rainbow");
    };

    const logOut = () => {
        // removeSessionCookie();
        removeStoredSession();
        setIsAuthenticated(false);
        history.push("/");
    };

    useEffect(() => {
        // const storedSession = getSessionCookie();
        const storedSession = getStoredSession();
        if (isAuthenticated) {
            // If session cookie expires after 14 days and page reloaded
            // if (storedSession.exp === undefined) setIsAuthenticated(false);
        } else {
            // Login, register, or hard page reload
            if (session === null && storedSession?.exp !== undefined) {
                setIsAuthenticated(true);
                console.log("session has been set ");
                setSession(storedSession);
            }
        }
    }, [isAuthenticated, session]);

    return (
        <SessionContext.Provider
            value={{ isAuthenticated, setIsAuthenticated, session, setSession, logIn, logOut }}
        >
            <Switch>
                <Route path="/" exact>
                    {isAuthenticated ? <Redirect to="/rainbow" /> : <Login />}
                </Route>

                <Route path="/register">
                    <Register />
                </Route>

                <ProtectedRoute path="/reset">
                    <ResetPassword />
                </ProtectedRoute>

                <ProtectedRoute path="/user">
                    <UserProfileRoute />
                </ProtectedRoute>

                <ProtectedRoute path="/rainbow">
                    <MapRoute />
                </ProtectedRoute>
            </Switch>
        </SessionContext.Provider>
    );
}

function ProtectedRoute({ path, children }) {
    const { isAuthenticated } = useContext(SessionContext);
    return <Route path={path}>{isAuthenticated ? children : <Redirect to="/" />}</Route>;
}

export default App;
