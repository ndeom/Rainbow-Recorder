import React, { useState, useRef, useEffect } from "react";
import Logo from "Components/Form/Logo/Logo";
import Username from "Components/Form/Username/Username";
import Password from "Components/Form/Password/Password";
import NewPassword from "Components/Form/Password/Password";
import FormButton from "Components/Form/Button/Button";
import RainbowBackground from "Components/RainbowBackground/RainbowBackground";
import { Link } from "react-router-dom";
import { uri } from "constants/uris";
import "./ResetPassword.scss";

const testDelay = (time) => new Promise((resolve) => setTimeout(resolve, time));

const submitFormData = async (credentials) => {
    // Wait 5 seconds for testing
    await testDelay(10000);
    const response = await fetch(uri.register, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    return response;
};

export default function ResetPassword() {
    const usernameRef = useRef("");
    const passwordRef = useRef("");
    const retypePasswordRef = useRef("");
    const [submitForm, setSubmitForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [usernameValErr, setUsernameValErr] = useState("");
    const [passwordValErr, setPasswordValErr] = useState("");
    const [newPasswordValErr, setNewPasswordValErr] = useState("");

    useEffect(() => {
        if (submitForm) {
            setLoading(true);
            const credentials = {
                username: usernameRef.current,
                password: passwordRef.current,
            };
            submitFormData(credentials)
                .then((response) => {
                    console.log("response received");
                    console.log(`response status: ${response.status}`);
                    console.log(`response object:`);
                    console.log(response);
                    if (response.status !== 200) {
                        setUsernameValErr(true);
                    }
                })
                .catch((error) =>
                    console.error(`Attempted to submit form data and got error: ${error}`)
                )
                .finally(() => setLoading(false));
        }
    }, [submitForm]);

    const [formComplete, setFormComplete] = useState(false);
    const [usernameComplete, setUsernameComplete] = useState(false);
    const [passwordComplete, setPasswordComplete] = useState(false);
    const [newPasswordComplete, setNewPasswordComplete] = useState(false);

    useEffect(() => {
        if (usernameComplete && passwordComplete && newPasswordComplete) setFormComplete(true);
        if ((!usernameComplete || !passwordComplete || !newPasswordComplete) && formComplete)
            setFormComplete(false);
    }, [formComplete, newPasswordComplete, passwordComplete, usernameComplete]);

    return (
        <div id="login">
            <div className="form-container">
                <Logo />
                <form id="login-form">
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
                    <NewPassword
                        passwordRef={retypePasswordRef}
                        passwordValErr={newPasswordValErr}
                        passwordComplete={newPasswordComplete}
                        setPasswordComplete={setNewPasswordComplete}
                        placeholder="New Password"
                    />
                    <FormButton
                        children={"Reset Password"}
                        setSubmitForm={setSubmitForm}
                        loading={loading}
                        formComplete={formComplete}
                    />
                </form>
            </div>
            <RainbowBackground />
        </div>
    );
}
