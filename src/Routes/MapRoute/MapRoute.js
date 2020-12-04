import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
import { SessionContext } from "Components/SessionContext";
import Map from "Components/Map/Map";
import SideBar from "Components/SideBar/SideBar";
import MapHeader from "Components/MapHeader/MapHeader";
import IOSSpinner from "Components/Spinner/IOSSpinner";
import { PostModal } from "Components/Post/Post";
import { fetchPostsInBounds } from "utils/helperfuncs";
import { ReactComponent as ImageIcon } from "Images/image.svg";
import { submitPost, signInFromSession } from "utils/helperfuncs";
import "./MapRoute.scss";

export default function MapRoute() {
    const { session } = useContext(SessionContext);

    const [userMarker, setUserMarker] = useState(null);

    const [mapBounds, setMapBounds] = useState({});

    const [modalToggled, setModalToggled] = useState(false);

    const [rainbowButtonToggled, setRainbowButtonToggled] = useState(false);

    const [postsLoading, setPostsLoading] = useState(true); // set to true to prevent error message from showing up
    const [posts, setPosts] = useState([]);
    const [postIds] = useState(() => new Set());
    const [expandedPost, setExpandedPost] = useState(null);

    const [markers, setMarkers] = useState([]);
    const [replaceMarkers, setReplaceMarkers] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null); // may want to reference id instead of object
    const selectedPostRef = useRef();

    const handleBoundChange = useCallback(async () => {
        try {
            let response = await fetchPostsInBounds(mapBounds);
            console.log("posts fetched");
            if (response.status === 401) {
                await signInFromSession();
                response = await fetchPostsInBounds(mapBounds);
            }
            const fetchedPosts = await response.json();
            return fetchedPosts;
        } catch (err) {
            console.error(`Error ocurred while fetching posts: ${err}`);
        }
    }, [mapBounds]);

    useEffect(() => {
        if (window.google) {
            handleBoundChange()
                .then((fetchedPosts) => {
                    if (fetchedPosts && fetchedPosts.posts.length) {
                        if (posts.length) {
                            for (let post of fetchedPosts.posts) {
                                if (
                                    !postIds.has(post.post_id) ||
                                    posts.length !== fetchedPosts.posts.length
                                ) {
                                    postIds.clear();
                                    for (let post of fetchedPosts.posts) postIds.add(post.post_id);
                                    setPostsLoading(true);
                                    setReplaceMarkers(true);
                                    setPosts(fetchedPosts.posts);
                                    break;
                                }
                            }
                        } else {
                            setPostsLoading(true);
                            setPosts(fetchedPosts.posts);
                        }
                    } else {
                        setPosts([]);
                    }
                })
                .catch((err) => console.error("Error while fetching posts: ", err))
                .finally(() => setTimeout(() => setPostsLoading(false), 1000));
        }
    }, [handleBoundChange, mapBounds, postIds, posts.length]);

    return (
        <div id="map-route">
            <MapHeader />
            <div id="map-route-body">
                <Map
                    {...mapProps}
                    userMarker={userMarker}
                    setUserMarker={setUserMarker}
                    mapBounds={mapBounds}
                    setMapBounds={setMapBounds}
                    modalToggled={modalToggled}
                    setModalToggled={setModalToggled}
                    posts={posts}
                    rainbowButtonToggled={rainbowButtonToggled}
                    setRainbowButtonToggled={setRainbowButtonToggled}
                    selectedMarker={selectedMarker}
                    setSelectedMarker={setSelectedMarker}
                    markers={markers}
                    setMarkers={setMarkers}
                    replaceMarkers={replaceMarkers}
                    setReplaceMarkers={setReplaceMarkers}
                />
                <SideBar
                    posts={posts}
                    postsLoading={postsLoading}
                    setExpandedPost={setExpandedPost}
                    selectedMarker={selectedMarker}
                    selectedPostRef={selectedPostRef}
                />
            </div>
            {modalToggled ? (
                <UploadModal
                    setModalToggled={setModalToggled}
                    handleBoundChange={handleBoundChange}
                    userMarker={userMarker}
                    setUserMarker={setUserMarker}
                    setRainbowButtonToggled={setRainbowButtonToggled}
                />
            ) : null}
            {expandedPost ? (
                <PostModal post={expandedPost} setExpandedPost={setExpandedPost} />
            ) : null}
        </div>
    );
}

function UploadModal({
    setModalToggled,
    handleBoundChange,
    userMarker,
    setUserMarker,
    setRainbowButtonToggled,
}) {
    const fileSubmitRef = useRef({});
    const captionRef = useRef("");

    const [dragOver, setDragOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [submissionError, setSubmissionError] = useState(false);

    const { session } = useContext(SessionContext);

    const handleSubmit = async () => {
        try {
            if (submissionError) setSubmissionError(false);
            setLoading(true);
            userMarker.setDraggable(false);
            const post = {
                userID: session.user_id,
                username: session.username,
                timestamp: new Date(Date.now()), // could probably change to just new Date()
                image: image,
                caption: captionRef.current,
                location: {
                    lat: userMarker.getPosition().lat(),
                    lng: userMarker.getPosition().lng(),
                },
            };
            const responseBody = await submitPost(post);
            if (responseBody.error) {
                setSubmissionError(true);
                setLoading(false);
            } else {
                setUserMarker(null);
                setModalToggled(false);
                setRainbowButtonToggled(false);
                handleBoundChange();
            }
        } catch (err) {
            console.error("Error while submitting post: ", err);
        }
    };

    const readAndStoreFile = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragOver(true);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files.length) {
            const file = event.dataTransfer.files[0];
            readAndStoreFile(file);
            event.dataTransfer.clearData();
        }
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragOver(false);
    };

    const handleFileSubmit = () => {
        const file = fileSubmitRef.current.files[0];
        readAndStoreFile(file);
    };

    return (
        <div id="upload-container">
            <div className="dark-background" onClick={() => setModalToggled(false)}></div>
            <div id="upload-modal">
                <ModalNav
                    image={image}
                    setImage={setImage}
                    setModalToggled={setModalToggled}
                    handleSubmit={handleSubmit}
                />
                {image ? (
                    loading ? (
                        <div id="spinner-backdrop">
                            <span>Uploading...</span>
                            <IOSSpinner />
                        </div>
                    ) : (
                        <ImagePreviewModal
                            image={image}
                            submissionError={submissionError}
                            handleSubmit={handleSubmit}
                            captionRef={captionRef}
                        />
                    )
                ) : (
                    <ImageSubmitModal
                        handleDragOver={handleDragOver}
                        handleDragLeave={handleDragLeave}
                        handleDrop={handleDrop}
                        dragOver={dragOver}
                        fileSubmitRef={fileSubmitRef}
                        handleFileSubmit={handleFileSubmit}
                    />
                )}
            </div>
        </div>
    );
}

function ModalNav({ image, setImage, setModalToggled, handleSubmit }) {
    const handleClickBack = () => (image ? setImage(null) : setModalToggled(false));
    const handleClickNext = () => image && handleSubmit();
    return (
        <div id="modal-nav">
            <button id="back-button" onClick={handleClickBack}>
                {image ? "Back" : "Exit"}
            </button>
            {image ? (
                <button id="next-button" onClick={handleClickNext}>
                    Post
                </button>
            ) : null}
        </div>
    );
}

function ImagePreviewModal({ image, submissionError, captionRef }) {
    return (
        <>
            <div id="submitted-image-container">
                <img id="submitted-image" alt="User submitted" src={image} />
            </div>
            {submissionError ? <PostSubmissionError /> : null}
            <div id="post-inputs">
                <textarea
                    id="caption"
                    name="caption"
                    placeholder="Write a caption..."
                    onChange={(e) => (captionRef.current = e.target.value)}
                />
            </div>
        </>
    );
}

function PostSubmissionError() {
    return (
        <div id="post-submission-error">
            There was an issue while trying to upload your post. Either try again or come back
            later.
        </div>
    );
}

function ImageSubmitModal({
    handleDragOver,
    handleDragLeave,
    handleDrop,
    dragOver,
    fileSubmitRef,
    handleFileSubmit,
}) {
    return (
        <>
            <div
                id="modal-drop"
                onDragOver={(e) => handleDragOver(e)}
                onDragLeave={(e) => handleDragLeave(e)}
                onDrop={(e) => handleDrop(e)}
            >
                <div id="modal-drop-label" className={`${dragOver ? "active" : ""}`}>
                    Drop images here
                </div>
            </div>
            <div id="modal-actions">
                <input
                    ref={fileSubmitRef}
                    id="file-input"
                    type="file"
                    name="files"
                    multiple=""
                    accept=".jpg,.jpeg,.png,.gif,.apng,.tiff,.tif,.bmp,.xcf,.webp,.mp4,.mov,.avi,.webm,.mpeg,.flv,.mkv,.mpv,.wmv"
                    onChange={handleFileSubmit}
                ></input>
                <label htmlFor="file-input">
                    <ImageIcon />
                    Choose Photo
                </label>
            </div>
        </>
    );
}

const mapProps = {
    options: {
        center: { lat: 38.9072, lng: 283 },
        zoom: 7,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
    },
    className: "map-box",
};

// const defaultPosts = [
//     {
//         id: 1,
//         username: "some guy",
//         caption: "this is some guy's caption",
//         timestamp: 1603307171,
//         coord: { lat: 38.9072, lng: 283 },
//         photo: "someamazonbucketurl.com/something",
//         likes: 4,
//         comments: [
//             {
//                 username: "userOne",
//                 comment: "wowee this looks great",
//             },
//             {
//                 username: "userTwo",
//                 comment: "man I love rainbows",
//             },
//         ],
//     },
//     {
//         id: 2,
//         username: "some guy's friend",
//         caption: "this is some guy's friend's caption",
//         timestamp: 1603307160,
//         coord: { lat: 40, lng: 250 },
//         photo: "someamazonbucketurl.com/something",
//         likes: 4,
//         comments: [
//             {
//                 username: "userThree",
//                 comment: "take better pictures nub",
//             },
//             {
//                 username: "userFour",
//                 comment: "ewww",
//             },
//         ],
//     },
//     {
//         id: 3,
//         username: "some guy",
//         caption:
//             "this is a super long caption about absolutely nothing weeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
//         timestamp: 1603306171,
//         coord: { lat: 35, lng: 274 },
//         photo: "someamazonbucketurl.com/something",
//         likes: 40,
//         comments: [
//             {
//                 username: "userFive",
//                 comment: "the best",
//             },
//         ],
//     },
// ];
