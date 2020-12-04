import React, { useState, useEffect, useRef } from "react";
import LoginTooltip from "Components/LoginTooltip/LoginTooltip";
import "./Password.scss";

export default function Password({
    password,
    setPassword,
    passwordComplete,
    setPasswordComplete,
    placeholder,
    submissionError,
}) {
    const [isActive, setIsActive] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputRef = useRef();
    const focusInput = () => inputRef.current.focus();

    useEffect(() => {
        if (isFocused && password && password.length !== 0) setIsActive(true);
        if (password === "" && password.length === 0) setIsActive(false);
    }, [isActive, isFocused, password]);

    useEffect(() => {
        if (password && password.length >= 8) setPasswordComplete(true);
        if (passwordComplete && password.length < 8) setPasswordComplete(false);
    }, [password, passwordComplete, setPasswordComplete]);

    return (
        <div className="input-container">
            <label
                htmlFor="password"
                className={`form-label ${
                    submissionError === "password length" || submissionError === "password mismatch"
                        ? "error"
                        : ""
                }`}
            >
                <span className={isActive ? "active" : ""} onClick={focusInput}>
                    {placeholder || "Password"}
                </span>
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    ref={inputRef}
                    name="password"
                    className={`form-input ${isActive ? "active" : ""}`}
                    type="password"
                ></input>
                {submissionError === "password length" ||
                submissionError === "password mismatch" ? (
                    <LoginTooltip>
                        {submissionError === "password length"
                            ? "Password incomplete."
                            : "Password did not match records."}
                    </LoginTooltip>
                ) : null}
            </label>
        </div>
    );
}
