import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Logo from "Components/Form/Logo/Logo";
import Username from "Components/Form/Username/Username";
import Password from "Components/Form/Password/Password";
import RetypePassword from "Components/Form/Password/Password";
import FormButton from "Components/Form/Button/Button";
import RainbowBackground from "Components/RainbowBackground/RainbowBackground";
import { Link } from "react-router-dom";
import { registerUser, setSessionCookie } from "utils/helperfuncs";
import "./Register.scss";

const testDelay = (time) => new Promise((resolve) => setTimeout(resolve, time));

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [loading, setLoading] = useState(false);
    // const [usernameValErr, setUsernameValErr] = useState("");
    // const [passwordValErr, setPasswordValErr] = useState("");
    const [retypePasswordValErr, setRetypePasswordValErr] = useState(false);
    const [submissionError, setSubmissionError] = useState("");

    const history = useHistory();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (passwordsMatch) {
            setLoading(true);
            const credentials = { username, password };
            try {
                const responseBody = await registerUser(credentials);
                setLoading(false);
                if (responseBody.error) {
                    setSubmissionError(responseBody.error);
                } else {
                    setSessionCookie();
                    history.push("/rainbow");
                }
            } catch (err) {
                console.error(`Attempted to submit form data and got error: ${err}`);
                setLoading(false);
            }
        } else {
            setRetypePasswordValErr(true);
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
        <div id="login">
            <div className="form-container">
                <Logo />
                <form id="login-form" onSubmit={(e) => handleSubmit(e)}>
                    <Username
                        username={username}
                        setUsername={setUsername}
                        // usernameValErr={usernameValErr}
                        usernameComplete={usernameComplete}
                        setUsernameComplete={setUsernameComplete}
                    />
                    <Password
                        password={password}
                        setPassword={setPassword}
                        // passwordValErr={passwordValErr}
                        passwordComplete={passwordComplete}
                        setPasswordComplete={setPasswordComplete}
                    />
                    <RetypePassword
                        password={retypePassword}
                        setPassword={setRetypePassword}
                        passwordValErr={retypePasswordValErr}
                        passwordComplete={retypePasswordComplete}
                        setPasswordComplete={setRetypePasswordComplete}
                        placeholder="Retype Password"
                    />
                    {submissionError ? <SubmissionError>{submissionError}</SubmissionError> : null}
                    {retypePasswordValErr ? (
                        <SubmissionError>Passwords do not match.</SubmissionError>
                    ) : null}
                    <FormButton
                        children={"Sign Up"}
                        loading={loading}
                        formComplete={formComplete}
                    />
                </form>
            </div>
            <RegisterModal />
            <RainbowBackground />
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
