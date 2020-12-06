import * as Cookies from "js-cookie";
import * as queryString from "query-string";
import { uri } from "constants/uris";

export const signIn = async (credentials) => {
    try {
        const response = await makePostRequest({ url: uri.login, bodyContent: credentials });
        const body = await response.json();
        return body;
    } catch (err) {
        throw err;
    }
};

export const signInFromSession = async () => {
    const credentials = await getSessionCookie();
    try {
        const response = await makePostRequest({
            url: uri.refresh,
            bodyContent: { userID: credentials.user_id, username: credentials.username },
        });
        const body = await response.json();
        console.log("body signInFromSession: ", body);
        return body;
    } catch (err) {
        throw err;
    }
};

export const registerUser = async (credentials) => {
    try {
        const response = await makePostRequest({ url: uri.register, bodyContent: credentials });
        const body = await response.json();
        return body;
    } catch (err) {
        throw err;
    }
};

export const fetchPostsInBounds = async (bounds) => {
    const keys = Object.keys(bounds);
    const fetchUrl =
        uri.getPosts +
        `?n=${bounds[keys[0]].j}&s=${bounds[keys[0]].i}&w=${bounds[keys[1]].i}&e=${
            bounds[keys[1]].j
        }`;
    try {
        let response = await makeAuthorizedGetRequest(fetchUrl);
        if (response.status === 401) {
            await signInFromSession();
            response = await makeAuthorizedGetRequest(fetchUrl);
        }
        const body = await response.json();
        return body;
    } catch (err) {
        throw err;
    }
};

export const fetchSinglePost = async (postID) => {
    const fetchUrl = uri.getSinglePost + `?postID=${postID}`;
    try {
        let response = await makeAuthorizedGetRequest(fetchUrl);
        if (response.status === 401) {
            await signInFromSession();
            response = await makeAuthorizedGetRequest(fetchUrl);
        }
        const { post } = await response.json();
        return post;
    } catch (err) {
        throw err;
    }
};

/**
 * @description Takes a photo object and submits to server, returning a URL
 * where the image is stored
 * @param {object} image
 * @returns {string} imageUrl
 */

export const submitImage = async (image) => {
    const formData = new FormData();
    try {
        const response = await makeAuthorizedPostRequest({
            url: uri.uploadImage,
            bodyContent: formData,
        });
        const imageUrl = await response.json();
        return imageUrl;
    } catch (err) {
        throw err;
    }
};

export const submitPost = async (post) => {
    console.log("Post: ", post);
    try {
        const response = await makeAuthorizedPostRequest({ url: uri.addPost, bodyContent: post });
        const body = await response.json();
        return body;
    } catch (err) {
        throw err;
    }
};

export const likePost = async (userID, postID) => {
    try {
        await makeAuthorizedPutRequest({ url: uri.likePost, bodyContent: { userID, postID } });
    } catch (err) {
        throw err;
    }
};

export const unlikePost = async (userID, postID) => {
    console.log("unliking post: ", postID);
    try {
        await makeAuthorizedPutRequest({ url: uri.unlikePost, bodyContent: { userID, postID } });
    } catch (err) {
        throw err;
    }
};

export const setToken = (token) => {
    localStorage.setItem("token", token);
};

export const getToken = () => {
    const token = localStorage.getItem("token");
    return token;
};

// export const setSessionFromToken = () => {
//     const payload = extractJWTPayload();
//     console.log("payload: ", payload);
//     localStorage.setItem("session", JSON.stringify(payload));
// };

export const setUserSession = (userInfo) => {
    localStorage.setItem("session", JSON.stringify(userInfo));
};

export const extractJWTPayload = () => {
    const token = localStorage.getItem("token");
    return JSON.parse(window.atob(token.split(".")[1]));
};

export const getStoredSession = () => {
    const session = JSON.parse(localStorage.getItem("session"));
    return session;
};

export const removeStoredSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("session");
};

// export const extractJWTPayload = () => {
//     const jwtFragment = Cookies.get("fragmentOne");
//     return JSON.parse(window.atob(jwtFragment.split(".")[1]));
// };

export const setSessionCookie = () => {
    Cookies.remove("session");
    const payload = extractJWTPayload();
    Cookies.set("session", payload, { expires: 14 });
};

export const removeSessionCookie = () => {
    Cookies.remove("session");
};

export const getSessionCookie = () => {
    const sessionCookie = Cookies.get("session");
    if (sessionCookie === undefined) {
        return {};
    } else {
        return JSON.parse(sessionCookie);
    }
};

// export const getSessionIfPresent = () => {
//     const sessionCookie = Cookies.get("session");
//     if (sessionCookie === undefined) {
//         return null;
//     } else {
//         return JSON.parse(sessionCookie);
//     }
// };

export const getSessionIfPresent = () => {
    const session = getStoredSession();
    return session ? session : null;
};

// export const confirmAuthentication = () => {
//     const cookie = getSessionCookie();
//     return cookie.exp && cookie.exp * 1000 > Date.now() ? true : false;
// };

export const confirmAuthentication = () => {
    const session = getStoredSession();
    console.log("Session: ", session);
    return session ? true : false;
};

export const setUserPosition = (map) => {
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

export const getUserPosition = async () => {
    console.log("inside getUserPosition");
    if (navigator.geolocation) {
        let position;
        console.log("initialzed position");
        const getLocation = async () => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    position = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    };
                    console.log("position set");
                    return;
                },
                () => {
                    throw new Error("User's location could not be found.");
                }
            );
        };
        await getLocation();
        console.log("returning position");
        return position;
    } else {
        throw new Error("User's location could not be found.");
    }
};

export const setPostLocation = async (post) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const position = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                };
                post.location = position;
            },
            () => {
                throw new Error("User's location could not be found.");
            }
        );
    } else {
        throw new Error("User's location could not be found.");
    }
};

export function addMarker(map, coordinate, userMarker, setUserMarker) {
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

export const postComment = async (newComment) => {
    try {
        const response = await makeAuthorizedPutRequest({
            url: uri.addComment,
            bodyContent: newComment,
        });
        return response;
    } catch (err) {
        throw err;
    }
};

export const resetPassword = async (userID, oldPassword, newPassword) => {
    try {
        const response = await makeAuthorizedPutRequest({
            url: uri.changePassword,
            bodyContent: { userID, oldPassword, newPassword },
        });
        return response;
    } catch (err) {
        throw err;
    }
};

export const checkUsernameAvailability = async (username) => {
    const fetchUrl = uri.getUsers + `?username=${username}`;
    try {
        const response = await makeGetRequst(fetchUrl);
        const body = await response.json();
        return body;
    } catch (err) {
        throw err;
    }
};

export const updateUsername = async (userID, newUsername) => {
    try {
        const response = await makeAuthorizedPutRequest({
            url: uri.changeUsername,
            bodyContent: { userID, newUsername },
        });
        const body = await response.json();
        return body;
    } catch (err) {
        throw err;
    }
};

export const updateScreenName = async (userID, screenName) => {
    try {
        const response = await makeAuthorizedPutRequest({
            url: uri.changeScreenName,
            bodyContent: { userID, screenName },
        });
        const body = await response.json();
        return body;
    } catch (err) {
        throw err;
    }
};

export const refreshToken = async (userID, username) => {
    try {
        const response = await makeAuthorizedPostRequest({
            url: uri.refresh,
            bodyContent: { userID, username },
        });
        const body = await response.json();
        return body;
    } catch (err) {
        throw err;
    }
};

export const submitProfilePicture = async (userID, blob) => {
    try {
        const timestamp = new Date(Date.now());
        const response = await makePostRequest({
            url: uri.profilePicture,
            bodyContent: { userID, timestamp, blob },
        });
        const body = response.json();
        return body;
    } catch (err) {
        throw err;
    }
};

const makePutRequest = async ({ url, bodyContent }) => {
    try {
        const response = await fetch(url, {
            method: "PUT",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyContent),
        });
        return response;
    } catch (err) {
        throw err;
    }
};

const makeAuthorizedPutRequest = async ({ url, bodyContent }) => {
    try {
        const response = await fetch(url, {
            method: "PUT",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + getToken(),
            },
            body: JSON.stringify(bodyContent),
        });
        return response;
    } catch (err) {
        throw err;
    }
};

const makeGetRequst = async (fetchUrl) => {
    try {
        const response = await fetch(fetchUrl, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
        });
        return response;
    } catch (err) {
        throw err;
    }
};

const makeAuthorizedGetRequest = async (fetchUrl) => {
    try {
        const response = await fetch(fetchUrl, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + getToken(),
            },
        });
        return response;
    } catch (err) {
        throw err;
    }
};

const makePostRequest = async ({ url, bodyContent }) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyContent),
        });
        return response;
    } catch (err) {
        throw err;
    }
};

const makeAuthorizedPostRequest = async ({ url, bodyContent }) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + getToken(),
            },
            body: JSON.stringify(bodyContent),
        });
        return response;
    } catch (err) {
        throw err;
    }
};
