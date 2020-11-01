import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { SessionContext } from "Components/SessionContext";
import Login from "Routes/Login/Login";
import Register from "Routes/Register/Register";
import ResetPassword from "Routes/ResetPassword/ResetPassword";
import MapRoute from "Routes/MapRoute/MapRoute";
import { getSessionCookie, confirmAuthentication } from "utils/helperfuncs";
import "./App.scss";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => confirmAuthentication());
    const [session, setSession] = useState(() => getSessionCookie());

    useEffect(() => {
        if (isAuthenticated && !session.exp) {
            setSession(() => getSessionCookie());
        }
    }, [isAuthenticated, session.exp]);

    return (
        <SessionContext.Provider
            value={{ isAuthenticated, setIsAuthenticated, session, setSession }}
        >
            <Router>
                <Switch>
                    <Route path="/" exact>
                        <Login />
                    </Route>
                    <Route path="/register">
                        <Register />
                    </Route>
                    <Route path="/reset">
                        {isAuthenticated ? <ResetPassword /> : <Redirect to="/" />}
                    </Route>
                    <Route path="/rainbow">
                        {isAuthenticated ? <MapRoute /> : <Redirect to="/" />}
                    </Route>
                </Switch>
            </Router>
        </SessionContext.Provider>
    );
}

export default App;
