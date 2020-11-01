import React, { useState, useEffect } from "react";
import "./Username.scss";

export default function Username({
    usernameRef,
    usernameComplete,
    setUsernameComplete,
    placeholder,
}) {
    const [username, setUsername] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    // const [fieldComplete, setFieldComplete] = useState(false);

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
                <span className={isActive ? "active" : ""}>{placeholder || "Username"}</span>
                <input
                    onChange={(e) => {
                        setUsername(e.target.value);
                        usernameRef.current = e.target.value;
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    name="username"
                    className={`form-input ${isActive ? "active" : ""}`}
                    type="text"
                ></input>
            </label>
        </div>
    );
}
