import React from "react";
import "./FancyButton.scss";

export default function FancyButton({ children }) {
    return <button className="fancy-button">{children}</button>;
}
