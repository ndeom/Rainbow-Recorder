import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import StatusTooltip from "Components/StatusTooltip/StatusTooltip";
import LoginTooltip from "Components/LoginTooltip/LoginTooltip";
import "./Username.scss";

export default function Username({
    username,
    setUsername,
    usernameComplete,
    setUsernameComplete,
    placeholder,
    submissionError,
}) {
    const [isActive, setIsActive] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputRef = useRef();
    const focusInput = () => inputRef.current.focus();

    useEffect(() => {
        if (isFocused && username.length !== 0) setIsActive(true);
        if (username.length === 0) setIsActive(false);
    }, [isActive, isFocused, username.length]);

    useEffect(() => {
        if (username.length >= 5) setUsernameComplete(true);
        if (usernameComplete && username.length < 5) setUsernameComplete(false);
    }, [setUsernameComplete, username.length, usernameComplete]);

    return (
        <div className="input-container">
            <label
                htmlFor="username"
                id="username-label"
                className={`form-label ${
                    submissionError === "username length" || submissionError === "username mismatch"
                        ? "error"
                        : ""
                }`}
            >
                <span className={isActive ? "active" : ""} onClick={focusInput}>
                    {placeholder || "Username"}
                </span>
                <input
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    ref={inputRef}
                    name="username"
                    className={`form-input ${isActive ? "active" : ""}`}
                    type="text"
                    autoComplete="off"
                ></input>
                {submissionError === "username length" ||
                submissionError === "username mismatch" ? (
                    <LoginTooltip>
                        {submissionError === "username length"
                            ? "Must enter username."
                            : "Username did not match records."}
                    </LoginTooltip>
                ) : null}
            </label>
        </div>
    );
}
