import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { SessionContext } from "Components/SessionContext";
import { ReactComponent as Like } from "Images/heart.svg";
import { ReactComponent as Unlike } from "Images/filledHeart.svg";
import { ReactComponent as SpeechBubble } from "Images/speechBubble.svg";
import { ReactComponent as LoadingRainbow } from "Images/LoadingRainbow.svg";
import { ReactComponent as AvatarIcon } from "Images/user.svg";
import Avatar from "Components/Avatar/Avatar";
import {
    likePost,
    unlikePost,
    postComment,
    fetchSinglePost,
    signInFromSession,
} from "utils/helperfuncs";
import "./Post.scss";
// import "./PostAlt.scss";

const sortComments = (comments) =>
    comments.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

export default function Post({ index, post, setExpandedPost, selectedMarker, selectedPostRef }) {
    const { session } = useContext(SessionContext);

    const [comment, setComment] = useState("");
    const [focusInput, setFocusInput] = useState(false);
    const inputRef = useRef();

    // Focuses textarea when speech bubble is pressed
    useEffect(() => {
        if (focusInput) inputRef.current.focus();
    }, [focusInput]);

    const [liked, setLiked] = useState(post.likes && post.likes[session.user_id] ? true : false);
    const [postLikes, setPostLikes] = useState(post.likes ? Object.keys(post.likes).length : null);

    const handleLike = () => {
        setLiked(!liked);
        if (liked) {
            unlikePost(session.user_id, post.post_id);
            setPostLikes(+postLikes - 1);
        } else {
            likePost(session.user_id, post.post_id);
            setPostLikes(+postLikes + 1);
        }
    };

    const [postComments, setPostComments] = useState(post.comments || []);
    const sortedComments = useMemo(() => sortComments(postComments), [postComments]);

    const handleComment = async (event) => {
        event.preventDefault();
        try {
            const newComment = {
                postID: post.post_id,
                comment,
                user_id: session.user_id,
                username: session.username,
                timestamp: new Date(Date.now()),
            };
            setPostComments((postComments) => [newComment, ...postComments]);
            setComment("");
            inputRef.current.value = "";
            await postComment(newComment);
        } catch (err) {
            console.error("Error ocurred while adding comment: ", err);
        }
    };

    return (
        <article
            className="post"
            key={`post-${index}`}
            ref={selectedMarker && selectedMarker.id === post.post_id ? selectedPostRef : null}
        >
            <Header post={post} />
            <Image post={post} />
            <div className="post-contents">
                <LikeCommentIcons
                    handleLike={handleLike}
                    liked={liked}
                    setFocusInput={setFocusInput}
                />
                <LikeCount postLikes={postLikes} post={post} />
                <Comments
                    sortedComments={sortedComments}
                    post={post}
                    setExpandedPost={setExpandedPost}
                />
                <Timestamp post={post} />
                <CommentInput
                    setFocusInput={setFocusInput}
                    inputRef={inputRef}
                    comment={comment}
                    setComment={setComment}
                    handleComment={handleComment}
                />
            </div>
        </article>
    );
}

export function PostModal({ post, setExpandedPost }) {
    const { session } = useContext(SessionContext);

    const [refetchedPost, setRefetchedPost] = useState();
    useEffect(() => {
        fetchSinglePost(post.post_id)
            .then((fetchedPost) => {
                console.log("fetchedPost: ", fetchedPost);
                setRefetchedPost(fetchedPost);
                setLiked(fetchedPost.likes && fetchedPost.likes[session.user_id] ? true : false);
                setPostLikes(fetchedPost.likes ? Object.keys(fetchedPost.likes).length : null);
                setPostComments(fetchedPost.comments);
            })
            .catch((err) => console.error(`Error ocurred while fetching post: ${err}`));
    }, [post.post_id, session.user_id]);

    const [comment, setComment] = useState("");
    const [focusInput, setFocusInput] = useState(false);
    const inputRef = useRef();

    // Focuses textarea when speech bubble is pressed
    useEffect(() => {
        if (focusInput) inputRef.current.focus();
    }, [focusInput]);

    const [liked, setLiked] = useState(post.likes && post.likes[session.user_id] ? true : false);
    const [postLikes, setPostLikes] = useState(post.likes ? Object.keys(post.likes).length : null);

    const handleLike = () => {
        setLiked(!liked);
        if (liked) {
            unlikePost(post.user_id, post.post_id);
            setPostLikes(+postLikes - 1);
        } else {
            likePost(post.user_id, post.post_id);
            setPostLikes(+postLikes + 1);
        }
    };

    const [postComments, setPostComments] = useState([]);
    const sortedComments = useMemo(() => sortComments(postComments), [postComments]);

    const handleComment = async (event) => {
        event.preventDefault();
        try {
            const newComment = {
                postID: post.post_id,
                comment,
                user_id: session.user_id,
                username: session.username,
                timestamp: new Date(Date.now()),
            };
            setPostComments((postComments) => [newComment, ...postComments]);
            setComment("");
            inputRef.current.value = "";
            await postComment(newComment);
        } catch (err) {
            console.error("Error ocurred while adding comment: ", err);
        }
    };

    return (
        <div className="post-modal-container">
            <div className="dark-background" onClick={() => setExpandedPost(null)}></div>
            <button onClick={() => setExpandedPost(null)} className="close-modal">
                &#10006;
            </button>
            <article className={`post-modal ${refetchedPost ? "" : "loading"}`}>
                {refetchedPost ? (
                    <>
                        <Image post={post} />
                        {/* <div className="post-contents"> */}
                        <Header post={post} />
                        <div className="contents-below-header">
                            <LikeCommentIcons
                                handleLike={handleLike}
                                liked={liked}
                                setFocusInput={setFocusInput}
                            />
                            <LikeCount postLikes={postLikes} post={post} />
                            <Timestamp post={post} />
                            <CommentInput
                                setFocusInput={setFocusInput}
                                inputRef={inputRef}
                                comment={comment}
                                setComment={setComment}
                                handleComment={handleComment}
                            />
                            <ModalComments sortedComments={sortedComments} post={post} />
                        </div>
                        {/* </div> */}
                    </>
                ) : (
                    <LoadingRainbow />
                )}
            </article>
        </div>
    );
}

function Header({ post }) {
    return (
        <header className="post-header">
            <Avatar /> <span>{post.username}</span>
        </header>
    );
}

function Image({ post }) {
    return (
        <img
            className="post-image"
            alt={`Post by ${post.username} containing a rainbow on ${post.timestamp}`}
            src={post.image}
        />
    );
}

// function Image({ post }) {
//     return (
//         <div className="post-image-container">
//             <img
//                 className="post-image"
//                 alt={`Post by ${post.username} containing a rainbow on ${post.timestamp}`}
//                 src={post.image}
//             />
//         </div>
//     );
// }

function LikeCommentIcons({ handleLike, liked, setFocusInput }) {
    return (
        <section className="like-comment">
            <span onClick={() => handleLike()}>
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
    );
}

function LikeCount({ postLikes }) {
    return <section className="post-likes">{`${postLikes ? postLikes : 0} likes`}</section>;
}

function Comments({ sortedComments, post, setExpandedPost }) {
    const togglePostModal = () => setExpandedPost(post);
    return (
        <div className="comments">
            <div className="author-caption">
                <span>{`${post.username}`}</span>
                <span>{`${post.caption}`}</span>
            </div>
            <div className="post-comments">
                {sortedComments && sortedComments.length > 2 ? (
                    <div
                        className="expand"
                        onClick={togglePostModal}
                    >{`See all ${post.comments.length} comments`}</div>
                ) : null}
                {sortedComments && sortedComments[0] ? (
                    <Comment comment={sortedComments[0]} />
                ) : null}
                {sortedComments && sortedComments[1] ? (
                    <Comment comment={sortedComments[1]} />
                ) : null}
            </div>
        </div>
    );
}

function ModalComments({ sortedComments, post }) {
    return (
        <div className="modal-comments">
            <ul className="post-comments">
                <div className="author-caption">
                    <div>
                        <AuthorProfilePicture post={post} />
                    </div>
                    <div>
                        <span>{`${post.username}`}</span>
                        {`${post.caption}`}
                    </div>
                </div>
                {sortedComments
                    ? sortedComments.map((comment, index) => (
                          <ModalComment key={`comment-${post.id}-${index}`} comment={comment} />
                      ))
                    : null}
            </ul>
        </div>
    );
}

function AuthorProfilePicture({ post }) {
    return post.profilePicture ? (
        <img alt="Author profile" src={post.profilePicture} />
    ) : (
        <AvatarIcon />
    );
}

function calculateTime(timeStr) {
    const postedTime = new Date(timeStr).getTime();
    const seconds = (Date.now() - postedTime) / 1000;
    if (seconds < 60) return `${seconds.toFixed(0)} SECONDS AGO`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${minutes.toFixed(0)} MINUTES AGO`;
    const hours = minutes / 60;
    return `${hours.toFixed(0)} HOURS AGO`;
}

function Timestamp({ post }) {
    return <div className="post-time">{calculateTime(post.timestamp)}</div>;
}

function CommentInput({ setFocusInput, inputRef, comment, setComment, handleComment }) {
    return (
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
                />
                <button
                    className={`post-comment ${comment.length ? "hightlighted" : ""}`}
                    type="submit"
                    onClick={handleComment}
                >
                    Post
                </button>
            </form>
        </section>
    );
}

function Comment({ comment }) {
    return (
        <div className="comment">
            <span className="comment-author">{`${comment.username}`}</span>
            {`${comment.comment}`}
        </div>
    );
}

function ModalComment({ comment }) {
    return (
        <li className="modal-comment">
            <div>
                <CommentProfilePicture comment={comment} />
            </div>
            <div>
                <Comment comment={comment} />
            </div>
        </li>
    );
}

function CommentProfilePicture({ comment }) {
    return comment.profilePicture ? (
        <img alt="User profile" src={comment.profilePicture} />
    ) : (
        <AvatarIcon />
    );
}
