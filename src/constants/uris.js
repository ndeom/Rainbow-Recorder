// const baseURI = "http://localhost:3001";
const baseURI = "https://rainbow-recorder-api.herokuapp.com";

export const uri = {
    getUsers: baseURI + "/api/users",
    login: baseURI + "/api/users/login",
    register: baseURI + "/api/users/register",
    refresh: baseURI + "/api/users/refresh",
    changeUsername: baseURI + "/api/users/username",
    changeScreenName: baseURI + "/api/users/screenname",
    changePassword: baseURI + "/api/users/password",
    getPosts: baseURI + "/api/posts",
    getSinglePost: baseURI + "/api/posts/singlepost",
    uploadImage: baseURI + "/api/posts/image",
    profilePicture: baseURI + "/api/users/profilepicture",
    addPost: baseURI + "/api/posts",
    likePost: baseURI + "/api/posts/like",
    unlikePost: baseURI + "/api/posts/unlike",
    addComment: baseURI + "/api/posts/comment",
    removeComment: baseURI + "/api/posts/uncomment",
};
