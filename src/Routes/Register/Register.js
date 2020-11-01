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
    const usernameRef = useRef("");
    const passwordRef = useRef("");
    const retypePasswordRef = useRef("");
    const [loading, setLoading] = useState(false);
    const [usernameValErr, setUsernameValErr] = useState("");
    const [passwordValErr, setPasswordValErr] = useState("");
    const [retypePasswordValErr, setRetypePasswordValErr] = useState("");
    const [submissionError, setSubmissionError] = useState("");

    const history = useHistory();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const credentials = {
            username: usernameRef.current,
            password: passwordRef.current,
        };

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
    };

    const [formComplete, setFormComplete] = useState(false);
    const [usernameComplete, setUsernameComplete] = useState(false);
    const [passwordComplete, setPasswordComplete] = useState(false);
    const [retypePasswordComplete, setRetypePasswordComplete] = useState(false);

    useEffect(() => {
        if (usernameComplete && passwordComplete && retypePasswordComplete) setFormComplete(true);
        if ((!usernameComplete || !passwordComplete || !retypePasswordComplete) && formComplete)
            setFormComplete(false);
    }, [formComplete, passwordComplete, retypePasswordComplete, usernameComplete]);

    return (
        <div id="login">
            <div className="form-container">
                <Logo />
                <form id="login-form" onSubmit={(e) => handleSubmit(e)}>
                    <Username
                        usernameRef={usernameRef}
                        usernameValErr={usernameValErr}
                        usernameComplete={usernameComplete}
                        setUsernameComplete={setUsernameComplete}
                    />
                    <Password
                        passwordRef={passwordRef}
                        passwordValErr={passwordValErr}
                        passwordComplete={passwordComplete}
                        setPasswordComplete={setPasswordComplete}
                    />
                    <RetypePassword
                        passwordRef={retypePasswordRef}
                        passwordValErr={retypePasswordValErr}
                        passwordComplete={retypePasswordComplete}
                        setPasswordComplete={setRetypePasswordComplete}
                        placeholder="Retype Password"
                    />
                    {submissionError ? <SubmissionError submissionError={submissionError} /> : null}
                    <FormButton
                        children={"Sign Up"}
                        // setSubmitForm={setSubmitForm}
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

function SubmissionError({ submissionError }) {
    return (
        <div id="submission-error">
            <div>{submissionError}</div>
        </div>
    );
}

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
