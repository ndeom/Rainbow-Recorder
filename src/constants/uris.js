const baseURI = "http://localhost:3001";

export const uri = {
    getUsers: baseURI + "/api/users",
    login: baseURI + "/api/users/login",
    register: baseURI + "/api/users/register",
    changeUsername: baseURI + "/api/users/username",
    changePassword: baseURI + "/api/users/password",
    getPosts: baseURI + "/api/posts",
    uploadImage: baseURI + "/api/posts/image",
    addPost: baseURI + "/api/posts",
    likePost: baseURI + "/api/posts/like",
    unlikePost: baseURI + "/api/posts/unlike",
    addComment: baseURI + "/api/posts/comment",
    removeComment: baseURI + "/api/posts/uncomment",
};