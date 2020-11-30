import React, { useState, useRef, useEffect, useContext } from "react";
import { SessionContext } from "Components/SessionContext";
import { useHistory } from "react-router-dom";
import Logo from "Components/Form/Logo/Logo";
import Username from "Components/Form/Username/Username";
import Password from "Components/Form/Password/Password";
import FormButton from "Components/Form/Button/Button";
import RainbowBackground from "Components/RainbowBackground/RainbowBackground";
import { Link } from "react-router-dom";
import { signIn, setSessionCookie } from "utils/helperfuncs";
// import "./Login.scss";
import "./LoginAlt.scss";

const testDelay = (time) => new Promise((resolve) => setTimeout(resolve, time));

export default function Login() {
    // const usernameRef = useRef("");
    // const passwordRef = useRef("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [submissionError, setSubmissionError] = useState("");
    const { logIn } = useContext(SessionContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const credentials = { username, password };
        try {
            const responseBody = await signIn(credentials);
            responseBody.error === undefined ? logIn() : setSubmissionError(responseBody.error);
        } catch (err) {
            console.error(`Attempted to submit form data and got error: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const [formComplete, setFormComplete] = useState(false);
    const [usernameComplete, setUsernameComplete] = useState(false);
    const [passwordComplete, setPasswordComplete] = useState(false);

    useEffect(() => {
        if (usernameComplete && passwordComplete) setFormComplete(true);
        if ((!usernameComplete || !passwordComplete) && formComplete) setFormComplete(false);
    }, [formComplete, passwordComplete, usernameComplete]);

    return (
        <div id="login" className="login">
            <div className="form-container" onSubmit={(e) => handleSubmit(e)}>
                <Logo />
                <form id="login-form">
                    <Username
                        // usernameRef={usernameRef}
                        username={username}
                        setUsername={setUsername}
                        usernameComplete={usernameComplete}
                        setUsernameComplete={setUsernameComplete}
                    />
                    <Password
                        // passwordRef={passwordRef}
                        password={password}
                        setPassword={setPassword}
                        passwordComplete={passwordComplete}
                        setPasswordComplete={setPasswordComplete}
                    />
                    {submissionError ? <SubmissionError submissionError={submissionError} /> : null}
                    <FormButton children={"Log In"} loading={loading} formComplete={formComplete} />
                </form>
            </div>
            <SignUpModal />
            <RainbowBackground />
        </div>
    );
}

function SubmissionError({ submissionError }) {
    return (
        <div id="submission-error">
            <div>{submissionError}</div>
        </div>
    );
}

function SignUpModal() {
    return (
        <div id="sign-up-modal">
            <p>
                Don't have an account?
                <Link
                    to={{
                        pathname: "/register",
                    }}
                >
                    Sign up
                </Link>
            </p>
        </div>
    );
}
