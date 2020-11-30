import React, { useEffect } from "react";
import Post from "Components/Post/Post";
import { ReactComponent as LoadingRainbow } from "Images/LoadingRainbow.svg";
import "./SideBar.scss";

export default function SideBar({
    posts,
    postsLoading,
    setExpandedPost,
    selectedMarker,
    selectedPostRef,
}) {
    useEffect(() => {
        if (selectedMarker) {
            selectedPostRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedMarker, selectedPostRef]);

    return (
        <div id="side-bar" className={`${postsLoading ? "loading" : ""}`}>
            {postsLoading ? (
                <LoadingRainbow />
            ) : posts.length ? (
                posts.map((post, index) => (
                    <Post
                        key={`post-${index}`}
                        index={index}
                        post={post}
                        setExpandedPost={setExpandedPost}
                        selectedMarker={selectedMarker}
                        selectedPostRef={selectedPostRef}
                    />
                ))
            ) : (
                <NoPostMessage />
            )}
        </div>
    );
}

function NoPostMessage() {
    return (
        <div id="no-post-message">
            <div id="frownie">:(</div> Sorry, there don't seem to be any posts here.
        </div>
    );
}
