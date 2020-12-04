import React from "react";
import { ReactComponent as Rainbow } from "Images/rainbow.svg";
import { ReactComponent as Cloud } from "Images/cloud.svg";
import "./Logo.scss";

export default function FormLogo() {
    return (
        <div className="form-logo-container">
            <Rainbow className="form-rainbow" />
            <Cloud className="cloud" />
            <h1 className="form-logo">
                <div>Rainbow</div>
                <div>Recorder</div>
            </h1>
        </div>
    );
}
