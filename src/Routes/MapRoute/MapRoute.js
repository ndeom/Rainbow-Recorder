import React, { useEffect, useState, useContext, useRef } from "react";
import { SessionContext } from "Components/SessionContext";
import Map from "Components/Map/Map";
import SideBar from "Components/SideBar/SideBar";
import MapHeader from "Components/MapHeader/MapHeader";
import { fetchPostsInBounds } from "utils/helperfuncs";
import { ReactComponent as ImageIcon } from "Images/image.svg";
import { submitImage } from "utils/helperfuncs";
import "./MapRoute.scss";

export default function MapRoute() {
    const { session, isAuthenticated } = useContext(SessionContext);
    const [markers, setMarkers] = useState();
    const [userMarker, setUserMarker] = useState();
    const [highlightedIndex, setHighlightedIndex] = useState(null);

    const [posts, setPosts] = useState(defaultPosts); // posts need to replace markers
    const [mapBounds, setMapBounds] = useState({});

    const [modalToggled, setModalToggled] = useState(false);

    useEffect(() => {
        // Only attempts to fetch posts if Google script has been
        // added to the document from Map.js
        if (window.google) {
            console.log("mapBounds: ", mapBounds);
            const handleBoundChange = async () => {
                try {
                    const posts = await fetchPostsInBounds(mapBounds);
                    // Move default posts to database
                    setPosts([...posts, ...defaultPosts]);
                } catch (err) {
                    console.error(`Error ocurred while fetching posts: ${err}`);
                }
            };
            handleBoundChange();
        }
    }, [mapBounds]);

    return (
        <div id="map-route">
            <MapHeader />
            <div id="map-route-body">
                <Map
                    {...mapProps}
                    markers={markers}
                    setMarkers={setMarkers}
                    userMarker={userMarker}
                    setUserMarker={setUserMarker}
                    highlightedIndex={highlightedIndex}
                    mapBounds={mapBounds}
                    setMapBounds={setMapBounds}
                    modalToggled={modalToggled}
                    setModalToggled={setModalToggled}
                />
                <SideBar
                    markers={markers}
                    posts={posts}
                    highlightedIndex={highlightedIndex}
                    setHighlightedIndex={setHighlightedIndex}
                />
            </div>
            {modalToggled ? <UploadModal setModalToggled={setModalToggled} /> : null}
        </div>
    );
}

function UploadModal({ setModalToggled }) {
    const [dragOver, setDragOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const readFile = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            console.log("file read");
            setImageUrl(reader.result);
        };
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
            readFile(file);
            event.dataTransfer.clearData();
        }
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragOver(false);
    };

    return (
        <div id="dark-background">
            <div id="upload-modal">
                <div id="modal-close-container">
                    <button id="modal-close" onClick={() => setModalToggled(false)}>
                        &#10006;
                    </button>
                </div>
                {imageUrl.length ? (
                    <>
                        <div id="submitted-image">
                            <img alt="User submitted" src={imageUrl}></img>
                        </div>
                        <div id="post-inputs">
                            <label htmlFor="caption">
                                <span id="caption-placeholder">Add a caption...</span>
                                <textarea id="caption" name="caption" />
                            </label>
                        </div>
                    </>
                ) : (
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
                                id="file-input"
                                type="file"
                                name="files"
                                multiple=""
                                accept=".jpg,.jpeg,.png,.gif,.apng,.tiff,.tif,.bmp,.xcf,.webp,.mp4,.mov,.avi,.webm,.mpeg,.flv,.mkv,.mpv,.wmv"
                            ></input>
                            <label htmlFor="file-input">
                                <ImageIcon />
                                Choose Photo
                            </label>
                            {/* <div id="modal-divider">or</div>
                    <div id="modal-text-picker">
                        <label id="modal-paste-label" htmlFor="paste-input">
                            <span>Paste image or URL</span>
                            <input
                                id="modal-paste-input"
                                name="paste-input"
                                placeholder="Paste image or URL"
                            ></input>
                        </label>
                    </div> */}
                        </div>
                    </>
                )}
            </div>
        </div>
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

const defaultPosts = [
    {
        id: 1,
        username: "some guy",
        caption: "this is some guy's caption",
        timestamp: 1603307171,
        coord: { lat: 38.9072, lng: 283 },
        photo: "someamazonbucketurl.com/something",
        likes: 4,
        comments: [
            {
                username: "userOne",
                comment: "wowee this looks great",
            },
            {
                username: "userTwo",
                comment: "man I love rainbows",
            },
        ],
    },
    {
        id: 2,
        username: "some guy's friend",
        caption: "this is some guy's friend's caption",
        timestamp: 1603307160,
        coord: { lat: 40, lng: 250 },
        photo: "someamazonbucketurl.com/something",
        likes: 4,
        comments: [
            {
                username: "userThree",
                comment: "take better pictures nub",
            },
            {
                username: "userFour",
                comment: "ewww",
            },
        ],
    },
    {
        id: 3,
        username: "some guy",
        caption:
            "this is a super long caption about absolutely nothing weeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        timestamp: 1603306171,
        coord: { lat: 35, lng: 274 },
        photo: "someamazonbucketurl.com/something",
        likes: 40,
        comments: [
            {
                username: "userFive",
                comment: "the best",
            },
        ],
    },
];
