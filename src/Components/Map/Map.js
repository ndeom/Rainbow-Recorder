import React, { useState, useRef, useEffect, memo } from "react";
import { functions, isEqual, omit } from "lodash";
import { ReactComponent as Rainbow } from "Images/rainbow.svg";
import "./Map.scss";

function Map({
    options = defaultOptions,
    className,
    coordinates = defaultCoordinates,
    markers,
    setMarkers,
    highlightedIndex,
    mapBounds,
    setMapBounds,
    modalToggled,
    setModalToggled,
}) {
    const ref = useRef();

    const [map, setMap] = useState();

    useEffect(() => {
        const onLoad = () => {
            // Create map and add any necessary listeners
            const newMap = new window.google.maps.Map(ref.current, { ...options });

            const changeMapBounds = () => {
                const newBounds = newMap.getBounds();
                setMapBounds(newBounds);
            };

            let timeout;
            newMap.addListener("bounds_changed", () => {
                if (timeout) {
                    clearTimeout(timeout);
                }
                timeout = setTimeout(changeMapBounds, 1000);
            });
            setMap(newMap);
        };

        if (!window.google) {
            const script = document.createElement("script");
            // Need to configure environment variables correctly
            // maybe in the command line
            // or alter react scripts
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDoZERCEHEuYz-uPoOjjevVvSt_JrcWKjQ`; //+ process.env.API_KEY;
            document.head.append(script);
            script.addEventListener("load", onLoad);
            return () => script.removeEventListener("load", onLoad);
        }
    }, [map, options, setMapBounds]);

    useEffect(() => {
        if (map) setUserPosition(map);
    }, [map]);

    useEffect(() => {
        if (map && !markers) {
            const rainbows = addRainbowMarkers(map, coordinates);
            // console.log("rainbows: ", rainbows);
            setMarkers(rainbows);
        }
    }, [coordinates, map, markers, setMarkers]);

    const [userMarker, setUserMarker] = useState();

    useEffect(() => {
        if (map && !userMarker)
            map.addListener("click", (event) =>
                addMarker(map, event.latLng, userMarker, setUserMarker)
            );
    }, [map, userMarker]);

    useEffect(() => {
        // If hightlighted index, animate marker
        // console.log("highlightedIndex: ", highlightedIndex);
        if (markers) {
            for (let marker of markers) {
                if (highlightedIndex === marker.id) {
                    marker.setAnimation(window.google.maps.Animation.BOUNCE);
                } else {
                    marker.setAnimation(null);
                }
            }
        }
    }, [highlightedIndex, markers]);

    return (
        <div id="map-container">
            <div style={{ height: "calc(100vh - 60px)", width: "70vw" }} {...{ ref, className }} />
            <AddRainbowButton setModalToggled={setModalToggled} />
        </div>
    );
}

function AddRainbowButton({ setModalToggled }) {
    const [toggled, setToggled] = useState(false);

    return (
        <div id="add-rainbow-container">
            {!toggled ? (
                <button id="add-rainbow-button" onClick={() => setToggled(true)}>
                    <Rainbow /> <span>&#10010;</span>
                </button>
            ) : (
                <>
                    <button
                        id="confirm-rainbow-button"
                        className="confirmation-button"
                        onClick={() => {
                            setToggled(false);
                            setModalToggled(true);
                        }}
                    >
                        <span>&#10004;</span>
                    </button>
                    <button
                        id="unconfirm-rainbow-button"
                        className="confirmation-button"
                        onClick={() => setToggled(false)}
                    >
                        <span>&#10006;</span>
                    </button>
                </>
            )}
        </div>
    );
}

const defaultOptions = {
    center: { lat: 38.9072, lng: 283 },
    zoom: 7,
    mapTypeControl: false,
    // zoomControl: false,
    streetViewControl: false,
    fullscreenControl: false,
};

function shouldNotUpdate(props, nextProps) {
    const [funcs, nextFuncs] = [functions(props), functions(nextProps)];
    const noPropChange = isEqual(omit(props, funcs), omit(nextProps, nextFuncs));
    const noFuncChange =
        funcs.length === nextFuncs.length &&
        funcs.every((func) => props[func].toString() === nextProps[func].toString());
    return noPropChange && noFuncChange;
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

    // coordinates.forEach((coordinate) => {
    //     const marker = new window.google.maps.Marker({
    //         map,
    //         position: coordinate.coord,
    //         icon: rainbowIcon,
    //     });
    //     marker.addListener("mouseover", () =>
    //         marker.setAnimation(window.google.maps.Animation.BOUNCE)
    //     );
    //     marker.addListener("mouseout", () => marker.setAnimation(null));
    // });
}

const setUserPosition = (map) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(pos);
                // setPosition(pos);
            },
            () => {
                console.error("User's location could not be found.");
            }
        );
    } else {
        console.error("User's location could not be found.");
    }
};

// function setUserMarker(location) {

// }

function addMarker(map, coordinate, userMarker, setUserMarker) {
    console.log("userMarker: ", userMarker);
    let marker = userMarker;
    if (!userMarker) {
        const rainbowIcon = {
            url: "https://www.flaticon.com/svg/static/icons/svg/458/458842.svg",
            anchor: new window.google.maps.Point(25, 50),
            scaledSize: new window.google.maps.Size(50, 50),
        };
        marker = new window.google.maps.Marker({
            map,
            draggable: true,
            icon: rainbowIcon,
        });
    }
    marker.setPosition(coordinate);
    setUserMarker(marker);
}

const defaultCoordinates = [
    {
        coord: { lat: 38.9072, lng: 283 },
        title: "sample title",
        id: 1,
    },
    {
        coord: { lat: 40, lng: 250 },
        title: "sample title",
        id: 2,
    },
    {
        coord: { lat: 35, lng: 274 },
        title: "sample title",
        id: 3,
    },
    {
        coord: { lat: 30, lng: 240 },
        title: "sample title",
        id: 4,
    },
    {
        coord: { lat: 32, lng: 250 },
        title: "sample title",
        id: 5,
    },
    {
        coord: { lat: 38, lng: 230 },
        title: "sample title",
        id: 6,
    },
    {
        coord: { lat: 29, lng: 240 },
        title: "sample title",
        id: 7,
    },
    {
        coord: { lat: 34, lng: 245 },
        title: "sample title",
        id: 8,
    },
    {
        coord: { lat: 41, lng: 280 },
        title: "sample title",
        id: 9,
    },
];

export default memo(Map, shouldNotUpdate);
