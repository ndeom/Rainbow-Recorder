import React, { useState, useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import Logo from "Components/Form/Logo/Logo";
import { SessionContext } from "Components/SessionContext";
import { ReactComponent as Rainbow } from "Images/rainbow.svg";
import { ReactComponent as OptionsIcon } from "Images/gear-option.svg";
import { ReactComponent as LogoutIcon } from "Images/logout.svg";
import { ReactComponent as LoadingRainbow } from "Images/LoadingRainbow.svg";
import Avatar from "Components/Avatar/Avatar";
import "./MapHeader.scss";

export default function MapHeader() {
    const [menuActive, setMenuActive] = useState(false);
    const avatarRef = useRef(null);

    return (
        <div id="map-header">
            <HeaderTitle />
            <HeaderAvatar
                menuActive={menuActive}
                setMenuActive={setMenuActive}
                avatarRef={avatarRef}
            />
            <HeaderMenuModal
                menuActive={menuActive}
                setMenuActive={setMenuActive}
                avatarRef={avatarRef}
            />
        </div>
    );
}

function HeaderTitle() {
    return (
        <div id="title-box">
            {/* <h1>Rainbow Recorder</h1> */}
            <Rainbow id="title-rainbow" />
            {/* <Logo /> */}
            <h1>
                <div>Rainbow</div>
                <div>Recorder</div>
            </h1>
        </div>
    );
}

function HeaderAvatar({ menuActive, setMenuActive, avatarRef }) {
    const { session } = useContext(SessionContext);
    const [username, setUsername] = useState("");

    useEffect(() => {
        console.log("session: ", session);
        if (session && session.username) setUsername(session.username);
    }, [session, session.username]);

    const handleToggle = () => {
        setMenuActive((prevMenuActive) => !prevMenuActive);
    };

    return (
        <div className="avatar" onClick={handleToggle} ref={avatarRef}>
            <Avatar /> <span>{username}</span>
        </div>
    );
}

function HeaderMenuModal({ menuActive, setMenuActive, avatarRef }) {
    const clickOutsideRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                clickOutsideRef.current &&
                !clickOutsideRef.current.contains(event.target) &&
                avatarRef.current &&
                !avatarRef.current.contains(event.target)
            )
                setMenuActive(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    });

    return menuActive ? (
        <div className="menu-modal" ref={clickOutsideRef}>
            <div className="modal-tip"></div>
            <div className="list-container">
                <ul>
                    {/* <PlaceholderItem key="dropdown-1" /> */}
                    <RainbowMap key="dropdown-1" />
                    <ManageAccount key="dropdown-2" />
                    <LogOut key="dropdown-3" />
                </ul>
            </div>
        </div>
    ) : null;
}

function RainbowMap() {
    const history = useHistory();
    return (
        <li onClick={() => history.push("/rainbow")}>
            <LoadingRainbow /> <span>Rainbow Map</span>
        </li>
    );
}

function ManageAccount() {
    const history = useHistory();
    return (
        <li onClick={() => history.push("/user")}>
            <OptionsIcon /> <span>Manage Account</span>
        </li>
    );
}

function LogOut() {
    const { logOut } = useContext(SessionContext);
    return (
        <li onClick={logOut}>
            <LogoutIcon /> <span>Log Out</span>
        </li>
    );
}
