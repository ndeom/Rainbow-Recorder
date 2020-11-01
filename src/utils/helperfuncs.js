import * as Cookies from "js-cookie";
import * as queryString from "query-string";
import { uri } from "constants/uris";

export const signIn = async (credentials) => {
    try {
        const response = await fetch(uri.login, {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
        const body = await response.json();
        return body;
    } catch (err) {
        throw err;
    }
};

export const registerUser = async (credentials) => {
    try {
        const response = await fetch(uri.register, {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
        const body = await response.json();
        return body;
    } catch (err) {
        throw err;
    }
};

export const fetchPostsInBounds = async (bounds) => {
    console.log("bounds: ", bounds);
    const fetchUrl =
        uri.getPosts + `?n=${bounds.Ya.j}&s=${bounds.Ya.i}&w=${bounds.Sa.i}&e=${bounds.Sa.j}`;
    console.log("fetchUrl: ", fetchUrl);
    try {
        const response = await fetch(fetchUrl, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        const posts = await response.json();
        return posts;
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
    console.log("Photo: ", image);
    const formData = new FormData();
    formData.append("image", image);
    try {
        const response = await fetch(uri.uploadImage, {
            method: "POST",
            credentials: "include",
            body: formData,
        });
        const imageUrl = await response.json();
        return imageUrl;
    } catch (err) {
        throw err;
    }
};

export const submitPost = async () => {};

export const extractJWTPayload = () => {
    const jwtFragment = Cookies.get("fragmentOne");
    return JSON.parse(window.atob(jwtFragment.split(".")[1]));
};

export const setSessionCookie = () => {
    Cookies.remove("session");
    const payload = extractJWTPayload();
    Cookies.set("session", payload, { expires: 14 });
};

export const getSessionCookie = () => {
    const sessionCookie = Cookies.get("session");
    if (sessionCookie === undefined) {
        return {};
    } else {
        return JSON.parse(sessionCookie);
    }
};

export const confirmAuthentication = () => {
    const cookie = getSessionCookie();
    return cookie.exp && cookie.exp * 1000 > Date.now() ? true : false;
};
