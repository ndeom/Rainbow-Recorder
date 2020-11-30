import React, { useState, useEffect, useRef } from "react";
import "./Username.scss";

export default function Username({
    username,
    setUsername,
    usernameComplete,
    setUsernameComplete,
    placeholder,
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
            <label htmlFor="username" id="username-label" className="form-label">
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
                ></input>
            </label>
        </div>
    );
}
