import React, { useState, useRef, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import Logo from "Components/Form/Logo/Logo";
import Username from "Components/Form/Username/Username";
import Password from "Components/Form/Password/Password";
import RetypePassword from "Components/Form/Password/Password";
import FormButton from "Components/Form/Button/Button";
import RainbowBackground from "Components/RainbowBackground/RainbowBackground";
import { ReactComponent as WavyBackSVG } from "Images/WavyBackground.svg";
import { Link } from "react-router-dom";
import { registerUser } from "utils/helperfuncs";
import "./Register.scss";
import { SessionContext } from "Components/SessionContext";

export default function Register() {
    const { logIn } = useContext(SessionContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [retypePasswordValErr, setRetypePasswordValErr] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);

    const handleSubmissionError = (error) => {
        if (username.length === 0) {
            console.log("username length");
            setSubmissionError("username length");
        } else if (password.length === 0) {
            setSubmissionError("password length");
        } else if (error.includes("Username is already in use")) {
            setSubmissionError("username taken");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formComplete) {
            setLoading(true);
            const credentials = { username, password };
            try {
                const responseBody = await registerUser(credentials);
                if (responseBody.error === undefined) {
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
    const [retypePasswordComplete, setRetypePasswordComplete] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    useEffect(() => {
        if (password === retypePassword) {
            setPasswordsMatch(true);
        } else if (passwordsMatch) {
            setPasswordsMatch(false);
        }
        if (retypePasswordValErr) setRetypePasswordValErr(false);
    }, [password, passwordsMatch, retypePassword, retypePasswordValErr]);

    useEffect(() => {
        if (usernameComplete && passwordComplete && retypePasswordComplete) {
            setFormComplete(true);
        } else if (formComplete) {
            setFormComplete(false);
        }
    }, [formComplete, passwordComplete, retypePasswordComplete, usernameComplete]);

    return (
        <div className="register">
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
                        <RetypePassword
                            password={retypePassword}
                            setPassword={setRetypePassword}
                            passwordComplete={retypePasswordComplete}
                            setPasswordComplete={setRetypePasswordComplete}
                            placeholder="Retype Password"
                            submissionError={submissionError}
                        />

                        <FormButton
                            children={"Sign Up"}
                            loading={loading}
                            formComplete={formComplete}
                        />
                    </form>
                    <RegisterModal />
                </div>
            </div>
            <RainbowBackground />
            <WavyBackSVG className="wavy-background" />
        </div>
    );
}

function SubmissionError({ children }) {
    return (
        <div id="submission-error">
            <div>{children}</div>
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

function RegisterModal() {
    return (
        <div id="sign-up-modal">
            <p>
                Already have an account?
                <Link
                    to={{
                        pathname: "/",
                    }}
                >
                    Log In
                </Link>
            </p>
        </div>
    );
}
