import React, { useState } from "react";
import Hamburger from "Components/MapHeader/Hamburger/Hamburger";
import { ReactComponent as Rainbow } from "Images/rainbow.svg";
import "./MapHeader.scss";

export default function MapHeader() {
    const [menuActive, setMenuActive] = useState(false);

    return (
        <div id="map-header">
            <div id="title-box">
                <h1>Rainbow Recorder</h1>
                <Rainbow id="title-rainbow" />
            </div>
            <Hamburger menuActive={menuActive} setMenuActive={setMenuActive} />
            <HamburgerMenu menuActive={menuActive} />
        </div>
    );
}

function HamburgerMenu({ menuActive }) {
    return (
        <div id="hamburger-menu" className={`${menuActive ? "active" : ""}`}>
            <ul>
                <li>Another Item</li>
                <li>Manage Account</li>
                <li>Log Out</li>
            </ul>
        </div>
    );
}
