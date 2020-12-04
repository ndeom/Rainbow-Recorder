import React, { useState, useRef, useEffect, memo } from "react";
import ReactDOMServer from "react-dom/server";
import { functions, isEqual, omit, replace } from "lodash";
import { ReactComponent as Rainbow } from "Images/rainbow.svg";
import { setUserPosition } from "utils/helperfuncs";
// import Avatar from "Components/Avatar/Avatar";
import { ReactComponent as AvatarIcon } from "Images/user.svg";
import "./Map.scss";

function Map({
    options,
    className,
    setMapBounds,
    setModalToggled,
    userMarker,
    setUserMarker,
    posts,
    rainbowButtonToggled,
    setRainbowButtonToggled,
    selectedMarker,
    setSelectedMarker,
    markers,
    setMarkers,
    replaceMarkers,
    setReplaceMarkers,
}) {
    const ref = useRef();
    const [map, setMap] = useState(null);

    useEffect(() => {
        const onLoad = () => {
            const newMap = new window.google.maps.Map(ref.current, { ...options });

            const changeMapBounds = () => {
                const bounds = newMap.getBounds();
                setMapBounds(bounds);
            };

            let timeout;
            newMap.addListener("bounds_changed", () => {
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(changeMapBounds, 1000); // setTimeout is causing marker to flicker before leaving
            });

            setMap(newMap);
        };

        if (!window.google) {
            const script = document.createElement("script");
            console.log("api_key: ", process.env.API_KEY);
            script.src =
                `https://maps.googleapis.com/maps/api/js?key=` + process.env.REACT_APP_API_KEY;
            document.head.append(script);
            script.addEventListener("load", onLoad);
            return () => script.removeEventListener("load", onLoad);
        } else if (window.google && map === null) {
            // Added in case user logs out and then logs back in. Google script is already present
            // in document (window.google), but the map and map bounds are not set.
            onLoad();
        }
    }, [map, options, setMapBounds]);

    useEffect(() => {
        if (map) {
            setUserPosition(map);
        }
    }, [map]);

    useEffect(() => {
        if (replaceMarkers) {
            console.log("MAP MARKERS REMOVED");
            removeMapMarkers(markers);
            setReplaceMarkers(false);
        }
    }, [markers, replaceMarkers, setReplaceMarkers]);

    useEffect(() => {
        if (map && posts.length) {
            console.log("MAP MARKERS ADDED");
            const newMarkers = addMapMarkers(map, posts);
            newMarkers.forEach((marker) => {
                marker.addListener("click", () => setSelectedMarker(marker));
                const {
                    username,
                    image,
                    timestamp,
                    profilePicture,
                    likes,
                    comments,
                } = marker.postMetadata;
                const contentTemplate = (
                    <div className="infowindow">
                        <header>
                            {profilePicture ? (
                                <img alt="User avatar" src={profilePicture} />
                            ) : (
                                <AvatarIcon />
                            )}{" "}
                            <span>{username}</span>
                        </header>
                        <img alt={`submitted by ${username} at ${timestamp}`} src={image} />
                        <div>{`${Object.keys(likes).length} likes`}</div>
                        <div>{`${(comments && comments.length) || 0} comments`}</div>
                    </div>
                );
                const staticTemplate = ReactDOMServer.renderToStaticMarkup(contentTemplate);
                const infoWindow = new window.google.maps.InfoWindow({ content: staticTemplate });
                marker.addListener("mouseover", () => infoWindow.open(map, marker));
                marker.addListener("mouseout", () => infoWindow.close());
            });
            setMarkers(newMarkers);
        }
    }, [map, posts, setMarkers, setSelectedMarker]);

    // Another option would be to change size of marker on hover. Maybe increase size by ~10px

    // useEffect(() => {
    //     if (markers) {
    //         for (let marker of markers) {
    //             if (highlightedIndex === marker.id) {
    //                 marker.setAnimation(window.google.maps.Animation.BOUNCE);
    //             } else {
    //                 marker.setAnimation(null);
    //             }
    //         }
    //     }
    // }, [highlightedIndex, markers]);

    return (
        <div id="map-container">
            <div {...{ ref, className }} />
            <AddRainbowButton
                map={map}
                setModalToggled={setModalToggled}
                userMarker={userMarker}
                setUserMarker={setUserMarker}
                rainbowButtonToggled={rainbowButtonToggled}
                setRainbowButtonToggled={setRainbowButtonToggled}
            />
        </div>
    );
}

function AddRainbowButton({
    map,
    setModalToggled,
    userMarker,
    setUserMarker,
    rainbowButtonToggled,
    setRainbowButtonToggled,
}) {
    const [hoveredElement, setHoveredElement] = useState("none");

    const addUserMarker = () => {
        const rainbowIcon = {
            url: "https://www.flaticon.com/svg/static/icons/svg/458/458842.svg",
            anchor: new window.google.maps.Point(25, 50),
            scaledSize: new window.google.maps.Size(50, 50),
        };
        const center = map.getCenter();
        const marker = new window.google.maps.Marker({
            map,
            position: center,
            icon: rainbowIcon,
            draggable: true,
        });
        setUserMarker(marker);
    };

    const removeUserMarker = () => {
        userMarker.setMap(null);
    };

    const setHovered = () => setHoveredElement("none");

    return (
        <div id="add-rainbow-container" onMouseLeave={setHovered}>
            {!rainbowButtonToggled ? (
                <RainbowButton
                    setRainbowButtonToggled={setRainbowButtonToggled}
                    addUserMarker={addUserMarker}
                />
            ) : (
                <>
                    <ConfirmRainbowButton
                        setModalToggled={setModalToggled}
                        hoveredElement={hoveredElement}
                        setHoveredElement={setHoveredElement}
                    />
                    {/* <span>|</span> */}
                    <UnconfirmRainbowButton
                        setRainbowButtonToggled={setRainbowButtonToggled}
                        removeUserMarker={removeUserMarker}
                        hoveredElement={hoveredElement}
                        setHoveredElement={setHoveredElement}
                    />
                </>
            )}
        </div>
    );
}

function RainbowButton({ setRainbowButtonToggled, addUserMarker }) {
    const toggleButton = () => {
        setRainbowButtonToggled(true);
        addUserMarker();
    };

    return (
        <button id="add-rainbow-button" onClick={toggleButton}>
            {/* <Rainbow /> <span>&#10010;</span> */}
            <span>&#10010; Add Rainbow</span>
            {/* <span>&#10010;</span> */}
        </button>
    );
}

function ConfirmRainbowButton({ setModalToggled, hoveredElement, setHoveredElement }) {
    const toggleModal = () => setModalToggled(true);

    const setHovered = () => setHoveredElement("confirm");

    return (
        <button
            id="confirm-rainbow-button"
            className="confirmation-button"
            onClick={toggleModal}
            onMouseEnter={setHovered}
        >
            <span>&#10004;</span>
        </button>
    );
}

function UnconfirmRainbowButton({
    setRainbowButtonToggled,
    removeUserMarker,
    hoveredElement,
    setHoveredElement,
}) {
    const toggleButton = () => {
        setRainbowButtonToggled(false);
        removeUserMarker();
    };

    const setHovered = () => setHoveredElement("unconfirm");

    return (
        <button
            id="unconfirm-rainbow-button"
            className="confirmation-button"
            onClick={toggleButton}
            onMouseEnter={setHovered}
        >
            <span>&#10006;</span>
        </button>
    );
}

// const defaultOptions = {
//     center: { lat: 38.9072, lng: 283 },
//     zoom: 7,
//     mapTypeControl: false,
//     // zoomControl: false,
//     streetViewControl: false,
//     fullscreenControl: false,
// };

// function shouldNotUpdate(props, nextProps) {
//     const [funcs, nextFuncs] = [functions(props), functions(nextProps)];
//     const noPropChange = isEqual(omit(props, funcs), omit(nextProps, nextFuncs));
//     const noFuncChange =
//         funcs.length === nextFuncs.length &&
//         funcs.every((func) => props[func].toString() === nextProps[func].toString());
//     return noPropChange && noFuncChange;
// }

function addMapMarkers(map, posts) {
    const rainbowIcon = {
        url: "https://www.flaticon.com/svg/static/icons/svg/458/458842.svg",
        anchor: new window.google.maps.Point(25, 50),
        scaledSize: new window.google.maps.Size(50, 50),
    };
    let markers = [];
    for (let post of posts) {
        const position = JSON.parse(post.location_point);
        const markerPos = {
            lng: position.coordinates[0],
            lat: position.coordinates[1],
        };
        const marker = new window.google.maps.Marker({
            map,
            position: markerPos,
            icon: rainbowIcon,
            animation: window.google.maps.Animation.DROP,
        });
        marker.id = post.post_id;
        marker.postMetadata = post;
        markers.push(marker);
    }
    return markers;
}

function removeMapMarkers(markers) {
    // markers.map((marker) => marker.setMap(null));
    for (let marker of markers) {
        // console.log("marker:", marker);
        marker.setMap(null);
    }
}

function addRainbowMarkers(map, coordinates) {
    const rainbowIcon = {
        url: "https://www.flaticon.com/svg/static/icons/svg/458/458842.svg",
        anchor: new window.google.maps.Point(25, 50),
        scaledSize: new window.google.maps.Size(50, 50),
    };
    let markers = [];

    for (let coordinate of coordinates) {
        const marker = new window.google.maps.Marker({
            map,
            position: coordinate.coord,
            icon: rainbowIcon,
        });
        marker.id = coordinate.id;
        marker.addListener("mouseover", () =>
            marker.setAnimation(window.google.maps.Animation.BOUNCE)
        );
        marker.addListener("mouseout", () => marker.setAnimation(null));
        markers.push(marker);
    }

    return markers;
}

// const defaultCoordinates = [
//     {
//         coord: { lat: 38.9072, lng: 283 },
//         title: "sample title",
//         id: 1,
//     },
//     {
//         coord: { lat: 40, lng: 250 },
//         title: "sample title",
//         id: 2,
//     },
//     {
//         coord: { lat: 35, lng: 274 },
//         title: "sample title",
//         id: 3,
//     },
//     {
//         coord: { lat: 30, lng: 240 },
//         title: "sample title",
//         id: 4,
//     },
//     {
//         coord: { lat: 32, lng: 250 },
//         title: "sample title",
//         id: 5,
//     },
//     {
//         coord: { lat: 38, lng: 230 },
//         title: "sample title",
//         id: 6,
//     },
//     {
//         coord: { lat: 29, lng: 240 },
//         title: "sample title",
//         id: 7,
//     },
//     {
//         coord: { lat: 34, lng: 245 },
//         title: "sample title",
//         id: 8,
//     },
//     {
//         coord: { lat: 41, lng: 280 },
//         title: "sample title",
//         id: 9,
//     },
// ];

// export default memo(Map, shouldNotUpdate);
export default Map;
