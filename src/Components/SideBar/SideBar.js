import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as Like } from "Images/heart.svg";
import { ReactComponent as Unlike } from "Images/filledHeart.svg";
import { ReactComponent as SpeechBubble } from "Images/speechBubble.svg";
import "./SideBar.scss";

export default function SideBar({ markers, highlightedIndex, setHighlightedIndex, posts }) {
    return (
        <div id="side-bar">
            {posts
                ? posts.map((post, index) => (
                      <Post
                          key={`post-${index}`}
                          index={index}
                          post={post}
                          setHighlightedIndex={setHighlightedIndex}
                      />
                  ))
                : null}
        </div>
    );
}

function Post({ index, post, setHighlightedIndex }) {
    const [liked, setLiked] = useState(false);
    const [comment, setComment] = useState("");
    const [focusInput, setFocusInput] = useState(false);
    const inputRef = useRef();

    // Focuses textarea when speech bubble is pressed
    useEffect(() => {
        if (focusInput) inputRef.current.focus();
    }, [focusInput]);

    return (
        <article
            className="post"
            key={`post-${index}`}
            onMouseEnter={() => setHighlightedIndex(post.id)}
            onMouseLeave={() => setHighlightedIndex(null)}
        >
            <header className="post-header">this is a post weeeeeeeeee</header>
            <div className="post-image-container">
                <img
                    className="post-image"
                    alt={`Post by ${post.username} containing a rainbow on ${post.timestamp}`}
                    src={post.photo}
                />
            </div>
            <div className="post-contents">
                <section className="like-comment">
                    <span onClick={() => setLiked(!liked)}>
                        <button className="button-wrap">
                            {liked ? <Unlike aria-label="Unlike" /> : <Like aria-label="Like" />}
                        </button>
                    </span>
                    <span onClick={() => setFocusInput(true)}>
                        <button className="button-wrap">
                            <SpeechBubble aria-label="Comment" />
                        </button>
                    </span>
                </section>
                <section className="post-likes">{`${post.likes} likes`}</section>
                <div className="comments">
                    <div className="author-caption">
                        <span>{`${post.username}`}</span>
                        <span>{`${post.caption}`}</span>
                    </div>
                    <div className="post-comments">
                        {post.comments.map((comment, index) => (
                            <Comment key={`comment-${post.id}-${index}`} comment={comment} />
                        ))}
                    </div>
                </div>
                <div className="post-time"></div>
                <section className="add-comment">
                    <form>
                        <textarea
                            aria-label="Add a comment..."
                            placeholder="Add a comment..."
                            autoComplete="off"
                            autoCorrect="off"
                            onBlur={() => setFocusInput(false)}
                            ref={inputRef}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                        <button className="post-comment" type="submit">
                            Post
                        </button>
                    </form>
                </section>
            </div>
        </article>
    );
}

function Comment({ comment }) {
    return (
        <div className="comment">
            <span className="comment-author">{`${comment.username}`}</span>
            <span className="comment-text">{`${comment.comment}`}</span>
        </div>
    );
}
