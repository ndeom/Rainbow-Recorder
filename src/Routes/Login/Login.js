import React, { useState, useRef, useEffect, useContext } from "react";
import { SessionContext } from "Components/SessionContext";
import { useHistory } from "react-router-dom";
import Logo from "Components/Form/Logo/Logo";
import Username from "Components/Form/Username/Username";
import Password from "Components/Form/Password/Password";
import FormButton from "Components/Form/Button/Button";
import RainbowBackground from "Components/RainbowBackground/RainbowBackground";
import { ReactComponent as WavyBackSVG } from "Images/WavyBackground.svg";
import { Link } from "react-router-dom";
import { signIn, setSessionCookie, setToken, setUserSession } from "utils/helperfuncs";
// import "./Login.scss";
import "./LoginAlt.scss";

export default function Login() {
    // const usernameRef = useRef("");
    // const passwordRef = useRef("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);
    const { logIn } = useContext(SessionContext);

    const handleSubmissionError = (error) => {
        if (username.length === 0) {
            setSubmissionError("username length");
        } else if (password.length === 0 || password.length < 8) {
            setSubmissionError("password length");
        } else if (error.includes("User does not exist")) {
            setSubmissionError("username mismatch");
        } else if (error.includes("Password did not match")) {
            setSubmissionError("password mismatch");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formComplete) {
            setLoading(true);
            const credentials = { username, password };
            try {
                const responseBody = await signIn(credentials);
                if (responseBody.error === undefined) {
                    setToken(responseBody.token);
                    setUserSession(responseBody.userInfo);
                    logIn();
                } else {
                    handleSubmissionError(responseBody.error);
                    setLoading(false);
                }
            } catch (err) {
                console.error(`Attempted to submit form data and got error: ${err}`);
                setLoading(false);
            }
        } else {
            handleSubmissionError();
        }
    };

    const [formComplete, setFormComplete] = useState(false);
    const [usernameComplete, setUsernameComplete] = useState(false);
    const [passwordComplete, setPasswordComplete] = useState(false);

    useEffect(() => {
        if (usernameComplete && passwordComplete) setFormComplete(true);
        if ((!usernameComplete || !passwordComplete) && formComplete) setFormComplete(false);
    }, [formComplete, passwordComplete, usernameComplete]);

    // useEffect(() => {
    //     if (submissionError) setSubmissionError(null);
    // }, [submissionError])

    return (
        <div className="login">
            <div className="logo-column">
                <Logo />
            </div>
            <div className="form-column">
                <div className="form-container">
                    <form id="login-form" onSubmit={handleSubmit}>
                        <Username
                            username={username}
                            setUsername={setUsername}
                            usernameComplete={usernameComplete}
                            setUsernameComplete={setUsernameComplete}
                            submissionError={submissionError}
                        />
                        <Password
                            password={password}
                            setPassword={setPassword}
                            passwordComplete={passwordComplete}
                            setPasswordComplete={setPasswordComplete}
                            submissionError={submissionError}
                        />
                        <FormButton
                            children={"Log In"}
                            loading={loading}
                            formComplete={formComplete}
                        />
                    </form>
                    <SignUpModal />
                </div>
            </div>
            <RainbowBackground />
            <WavyBackSVG className="wavy-background" />
        </div>
    );
}

// function SubmissionError({ submissionError }) {
//     return (
//         <div id="submission-error">
//             <div>{submissionError}</div>
//         </div>
//     );
// }

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
