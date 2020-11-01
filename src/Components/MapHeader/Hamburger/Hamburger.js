import React from "react";
import "./Hamburger.scss";

export default function Hamburger({ menuActive, setMenuActive }) {
    return (
        <div role="button" id="hamburger" onClick={() => setMenuActive(!menuActive)}>
            <div className={`hamburger-line ${menuActive ? "active" : ""}`} id="line-1"></div>
            <div className={`hamburger-line ${menuActive ? "active" : ""}`} id="line-2"></div>
            <div className={`hamburger-line ${menuActive ? "active" : ""}`} id="line-3"></div>
        </div>
    );
}
