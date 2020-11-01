import React, { useState, useEffect } from "react";
import "./Password.scss";

export default function Password({
    passwordRef,
    passwordComplete,
    setPasswordComplete,
    placeholder,
}) {
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (isFocused && password.length !== 0) setIsActive(true);
        if (password.length === 0) setIsActive(false);
    }, [isActive, isFocused, password.length]);

    useEffect(() => {
        if (password.length >= 8) setPasswordComplete(true);
        if (passwordComplete && password.length < 8) setPasswordComplete(false);
    }, [password.length, passwordComplete, setPasswordComplete]);

    return (
        <div className="input-container">
            <label htmlFor="password" id="password-label" className="form-label">
                <span className={isActive ? "active" : ""}>{placeholder || "Password"}</span>
                <input
                    onChange={(e) => {
                        setPassword(e.target.value);
                        passwordRef.current = e.target.value;
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    name="password"
                    className={`form-input ${isActive ? "active" : ""}`}
                    type="password"
                ></input>
            </label>
        </div>
    );
}
