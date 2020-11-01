import React from "react";
import { ReactComponent as Rainbow } from "Images/rainbow.svg";
import "./Logo.scss";

export default function FormLogo() {
    return (
        <div className="form-logo-container">
            <h1 className="form-logo">Rainbow Recorder</h1>
            <Rainbow className="form-rainbow" />
        </div>
    );
}
