import React, { useContext, useReducer, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Spinner from "Components/Spinner/IOSSpinner";
import { SessionContext } from "Components/SessionContext";
import Header from "Components/MapHeader/MapHeader";
import { ReactComponent as AvatarIcon } from "Images/user.svg";
import { ReactComponent as EditIcon } from "Images/edit.svg";
import ImageCropper from "Components/ImageCropper/ImageCropper";
import StatusTooltip from "Components/StatusTooltip/StatusTooltip";
import {
    resetPassword,
    checkUsernameAvailability,
    updateScreenName,
    updateUsername,
    setSessionCookie,
    refreshToken,
    getSessionCookie,
    submitProfilePicture,
} from "utils/helperfuncs";
import "./UserProfile.scss";

const StateContext = React.createContext();

export default function UserProfileRoute() {
    return (
        <UserProfileContent>
            <Header />
            <PageBody>
                <NavColumn />
                <PageContents>
                    <UserCard />
                    <ResetPassword />
                </PageContents>
            </PageBody>
        </UserProfileContent>
    );
}

function UserProfileContent({ children }) {
    const { setSession } = useContext(SessionContext);

    const userReducer = (oldState, newState) => ({ ...oldState, ...newState });
    const [state, dispatch] = useReducer(userReducer, {
        currentTab: "user information",
    });

    const updateSession = () => {
        setSessionCookie();
        setSession(() => getSessionCookie());
        window.location.reload();
    };

    return (
        <StateContext.Provider value={{ state, dispatch, updateSession }}>
            <div className="user-profile-route">{children}</div>
        </StateContext.Provider>
    );
}

function PageBody({ children }) {
    return <div className="profile-page-body">{children}</div>;
}

function NavColumn() {
    const { state, dispatch } = useContext(StateContext);
    return (
        <div className="nav-column">
            <ul>
                <li
                    className={`${state.currentTab === "user information" ? "highlighted" : ""}`}
                    onClick={() => dispatch({ currentTab: "user information" })}
                >
                    User Information
                </li>
                <li
                    className={`${state.currentTab === "reset password" ? "highlighted" : ""}`}
                    onClick={() => dispatch({ currentTab: "reset password" })}
                >
                    Reset Password
                </li>
            </ul>
        </div>
    );
}

function PageContents({ children }) {
    return <div className="profile-page-contents">{children}</div>;
}

function UserCard() {
    const { session, setSession } = useContext(SessionContext);
    const { state, dispatch, updateSession } = useContext(StateContext);

    const [username, setUsername] = useState(session.username);
    const [screenName, setScreenName] = useState(session.screenName);

    const [fetching, setFetching] = useState(false);
    const [status, setStatus] = useState(null);

    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (username.length && username !== session.username) {
            console.log("set fetching");
            setFetching(true);
            checkUsernameAvailability(username)
                // Causes an issue
                .then((res) => {
                    console.log("set not fetching");
                    setFetching(false);
                    // setResponseStatus(res);
                    setStatus(res.message ? "success" : "error");
                })
                .catch((err) =>
                    console.error("Error while checking username availability: ", err.stack)
                );
        }
    }, [session.username, username]);

    useEffect(() => {
        if (!fetching && status && (username.length === 0 || username === session.username)) {
            console.log("set to null");
            // setResponseStatus(null);
            setStatus(null);
        }
    }, [fetching, session.username, status, username]);

    const handleProfileUpdate = () => {
        if (status === "error") return;
        const handleUpdateUsername = async () => updateUsername(session.user_id, username);
        const handleUpdateScreenName = async () => updateScreenName(session.user_id, screenName);
        let promises = [];
        if (username !== session.username && username.length !== 0)
            promises.push(handleUpdateUsername);
        if (screenName !== session.screenName) promises.push(handleUpdateScreenName);

        if (promises.length !== 0) {
            setUpdating(true);
            Promise.all(promises.map((promise) => promise()))
                .then((res) => {
                    console.log("res: ", res);
                    return refreshToken(session.user_id, username);
                })
                .then(() => updateSession())
                .catch((err) => {
                    setUpdating(false);
                    console.error("Error ocurred while updating profile: ", err.stack);
                });
        }
    };

    return state.currentTab === "user information" ? (
        <article className="user-card">
            <ModifiableProfilePicture />

            <ProfileUsername
                username={username}
                setUsername={setUsername}
                // responseStatus={responseStatus}
                status={status}
                fetching={fetching}
            />

            <ProfileScreenName
                screenName={screenName}
                setScreenName={setScreenName}
                session={session}
            />

            <button onClick={handleProfileUpdate} className="profile-button">
                {updating ? "Updating..." : "Update profile"}
            </button>
        </article>
    ) : null;
}

function ProfileScreenName({ screenName, setScreenName, session }) {
    return (
        <label className="profile-screenname profile-input">
            <span>Screen name</span>
            <input
                onChange={(e) => setScreenName(e.target.value)}
                type="text"
                defaultValue={screenName}
                spellCheck="false"
            />
        </label>
    );
}

function ProfileUsername({ username, setUsername, status, fetching }) {
    const [focused, setFocused] = useState(false);
    const [usernameTimeout, setUsernameTimeout] = useState(null);

    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);
    const handleInputChange = (e) => {
        // Persist synthetic event to persist target.value
        e.persist();
        if (usernameTimeout) clearTimeout(usernameTimeout);
        const timeout = setTimeout(() => {
            setUsernameTimeout(null);
            setUsername(e.target.value);
        }, 200);
        setUsernameTimeout(timeout);
    };

    return (
        <div className="profile-username-container">
            <label
                className={`profile-username profile-input ${status === "error" ? "error" : ""}`}
            >
                <span>Username</span>
                <div className="profile-input-container">
                    <input
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        type="text"
                        defaultValue={username}
                        spellCheck="false"
                    />
                    <div className="status-icon">
                        {fetching ? (
                            <Spinner />
                        ) : status === "success" ? (
                            <span className="success">&#10004;</span>
                        ) : status === "error" ? (
                            <span className="error">&#10006;</span>
                        ) : null}
                    </div>
                </div>
            </label>
            {focused && status ? (
                <StatusTooltip status={status === "success" ? "success" : "error"}>
                    {status === "success" ? "Username is available." : "Username is not available."}
                </StatusTooltip>
            ) : null}
        </div>
    );
}

function ModifiableProfilePicture() {
    const { session } = useContext(SessionContext);
    const [inputImg, setInputImg] = useState("");
    // const [cropVisible, setCropVisible] = useState(false);
    const fileInputRef = useRef();
    const selectInput = (e) => {
        // Prevents page reload
        e.preventDefault();
        fileInputRef.current.click();
    };

    const onInputImgChange = (e) => {
        // Get file from file input
        const file = e.target.files[0];
        const reader = new FileReader();
        console.log("file: ", file);
        // Store image in state when loaded
        reader.addEventListener(
            "load",
            () => {
                setInputImg(reader.result);
                // Clears input files
                fileInputRef.current.value = null;
            },
            false
        );
        reader.readAsDataURL(file);
    };

    return (
        <>
            <form className="profile-picture">
                {session.profilePicture ? (
                    <img alt="User profile" src={session.profilePicture} />
                ) : (
                    <AvatarIcon />
                )}
                <input
                    onChange={onInputImgChange}
                    ref={fileInputRef}
                    className="file-chooser"
                    type="file"
                    accept="image/*"
                ></input>
                <button onClick={selectInput}>
                    <EditIcon /> <span>Edit</span>
                </button>
            </form>
            {inputImg.length ? (
                <ProfileImageCropModal inputImg={inputImg} setInputImg={setInputImg} />
            ) : null}
        </>
    );
}

function ProfileImageCropModal({ inputImg, setInputImg }) {
    const { session } = useContext(SessionContext);
    const { updateSession } = useContext(StateContext);

    const [blob, setBlob] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const closeModal = () => setInputImg("");

    const submitImage = () => {
        // console.log("blob: ", blob);
        setSubmitting(true);
        submitProfilePicture(session.user_id, blob)
            .then(() => refreshToken(session.user_id, session.username))
            .then(() => updateSession())
            .catch((err) => {
                setSubmitting(false);
                console.error("Error while submitting image: ", err.stack);
            });
    };

    return (
        <>
            <div className="dark-background" onClick={closeModal}></div>
            <div className="crop-modal">
                <div className="crop-header">
                    <h2>Crop your new profile picture</h2>
                </div>
                <div className="cropper-container">
                    <ImageCropper inputImg={inputImg} blob={blob} setBlob={setBlob} />
                </div>
                <div className="crop-button">
                    <button
                        className={`profile-button ${submitting ? "disabled" : ""}`}
                        onClick={submitImage}
                        disabled={submitting ? true : false}
                    >
                        {submitting ? "Submitting..." : "Set your new profile picture"}
                    </button>
                </div>
            </div>
        </>
    );
}

function ResetPassword() {
    const { session } = useContext(SessionContext);
    const { state } = useContext(StateContext);

    const [oldPassword, setOldPassword] = useState("");
    const [oldFocused, setOldFocused] = useState(false);
    const oldPassRef = useRef();

    const [newPassword, setNewPassword] = useState("");
    const [newFocused, setNewFocused] = useState(false);
    const newPassRef = useRef();

    const [loading, setLoading] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            setSubmissionError("length");
            return;
        }

        setLoading(true);
        resetPassword(session.user_id, oldPassword, newPassword)
            .then((res) => {
                console.log("res: ", res);
                if (res.status === 200 && !res.error) {
                    setOldPassword("");
                    oldPassRef.current.value = "";
                    setNewPassword("");
                    newPassRef.current.value = "";
                } else if (res.status === 200 && res.error) {
                    setSubmissionError("mismatch");
                }
            })
            .catch((err) => console.error("Error while changing password: ", err))
            .finally(() => setLoading(false));
    };

    const handleOldPassword = (e) => {
        if (submissionError === "mismatch") setSubmissionError(null);
        setOldPassword(e.target.value);
    };

    const handleNewPassword = (e) => {
        if (submissionError === "length") setSubmissionError(null);
        setNewPassword(e.target.value);
    };

    return state.currentTab === "reset password" ? (
        <div className="reset-password">
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <div className="profile-input-container">
                    <label
                        className={`profile-username profile-input ${
                            submissionError === "mismatch" ? "error" : ""
                        }`}
                    >
                        <span>Old Password</span>
                        <input
                            ref={oldPassRef}
                            onChange={handleOldPassword}
                            type="password"
                            onFocus={() => setOldFocused(true)}
                            onBlur={() => setOldFocused(false)}
                        />
                    </label>
                    {oldFocused && submissionError === "mismatch" ? (
                        <StatusTooltip status="error">
                            Password must be 8 or more characters.
                        </StatusTooltip>
                    ) : null}
                </div>
                <div className="profile-input-container">
                    <label
                        className={`profile-screenname profile-input ${
                            submissionError === "length" ? "error" : ""
                        }`}
                    >
                        <span>New password</span>
                        <input
                            ref={newPassRef}
                            onChange={handleNewPassword}
                            type="password"
                            onFocus={() => setNewFocused(true)}
                            onBlur={() => setNewFocused(false)}
                        />
                    </label>
                    {newFocused && submissionError === "length" ? (
                        <StatusTooltip status="error">Passwords need to match.</StatusTooltip>
                    ) : null}
                </div>
                <button className="profile-button">
                    {loading ? "Resetting..." : "Reset password"}
                </button>
            </form>
        </div>
    ) : null;
}

// function InputWithStatusTooltip({ state, setState, status }) {}
