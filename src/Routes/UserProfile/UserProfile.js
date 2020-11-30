import React, { useContext, useReducer, useState, useEffect, useRef } from "react";
// import { useHistory } from "react-router-dom";
import { SessionContext } from "Components/SessionContext";
import Header from "Components/MapHeader/MapHeader";
import { ReactComponent as AvatarIcon } from "Images/user.svg";
import { ReactComponent as EditIcon } from "Images/edit.svg";
import ImageCropper from "Components/ImageCropper/ImageCropper";
import { resetPassword } from "utils/helperfuncs";
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
    const userReducer = (oldState, newState) => ({ ...oldState, ...newState });
    const [state, dispatch] = useReducer(userReducer, {
        currentTab: "user information",
    });
    return (
        <StateContext.Provider value={{ state, dispatch }}>
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
    const { session } = useContext(SessionContext);
    const { state, dispatch } = useContext(StateContext);

    const [username, setUsername] = useState(session.username);
    const [screenName, setScreenName] = useState(session.screenname);

    return state.currentTab === "user information" ? (
        <article className="user-card">
            <ModifiableProfilePicture />

            <label className="profile-username profile-input">
                <span>Username</span>
                <input
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    defaultValue={session.username}
                    spellCheck="false"
                />
            </label>

            <label className="profile-screenname profile-input">
                <span>Screen name</span>
                <input
                    onChange={(e) => setScreenName(e.target.value)}
                    type="text"
                    defaultValue={session.screenname || null}
                    spellCheck="false"
                />
            </label>

            <button className="profile-button">Update profile</button>
        </article>
    ) : null;
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
    const closeModal = () => setInputImg("");

    return (
        <>
            <div className="dark-background" onClick={closeModal}></div>
            <div className="crop-modal">
                <div className="crop-header">
                    <h2>Crop your new profile picture</h2>
                </div>
                <div className="cropper-container">
                    <ImageCropper inputImg={inputImg} />
                </div>
                <div className="crop-button">
                    <button className="profile-button">Set your new profile picture</button>
                </div>
            </div>
        </>
    );
}

function ResetPassword() {
    const { state } = useContext(StateContext);

    const [password, setPassword] = useState("");
    const [passwordComplete, setPasswordComplete] = useState(false);
    const [retypePassword, setRetypePassword] = useState("");
    const [retypePasswordComplete, setRetypePasswordComplete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formComplete, setFormComplete] = useState(false);
    const [submissionError, setSubmissionError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const responseBody = await resetPassword({ password });
            if (responseBody.error) {
                setSubmissionError(responseBody.error);
            } else {
                setPassword("");
                setRetypePassword("");
            }
        } catch (err) {
            console.error(`Attempted to submit form data and got error: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (passwordComplete && retypePasswordComplete) setFormComplete(true);
        if ((!passwordComplete || !retypePasswordComplete) && formComplete) setFormComplete(false);
    }, [formComplete, passwordComplete, retypePasswordComplete]);

    return state.currentTab === "reset password" ? (
        <div className="reset-password">
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <label className="profile-username profile-input">
                    <span>Password</span>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" />
                </label>
                <label className="profile-screenname profile-input">
                    <span>Retype password</span>
                    <input onChange={(e) => setRetypePassword(e.target.value)} type="password" />
                </label>
                <button className="profile-button">Reset password</button>
            </form>
        </div>
    ) : null;
}

function SubmissionError({ submissionError }) {
    return submissionError ? <div className="submission-error">{submissionError}</div> : null;
}

function Edit({ hovered }) {
    return hovered ? (
        <div className="edit">
            <EditIcon />
        </div>
    ) : null;
}
