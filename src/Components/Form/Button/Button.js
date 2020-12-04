import React from "react";
import IOSSpinner from "Components/Spinner/IOSSpinner";
import "./Button.scss";

export default function Button({ children, setSubmitForm, loading, formComplete }) {
    return (
        <div className="form-button-container">
            <button
                type="submit"
                className={`form-button ${loading ? "disabled" : ""}`}
                // onClick={() => setSubmitForm(true)}
                // disabled={formComplete ? false : true}
            >
                {loading ? "Logging in..." : children}
            </button>
        </div>
    );
}
