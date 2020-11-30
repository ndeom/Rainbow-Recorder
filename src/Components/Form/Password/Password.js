import React, { useState, useEffect, useRef } from "react";
import "./Password.scss";

export default function Password({
    password,
    setPassword,
    passwordComplete,
    setPasswordComplete,
    placeholder,
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
            <label htmlFor="password" className="form-label">
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
            </label>
        </div>
    );
}
