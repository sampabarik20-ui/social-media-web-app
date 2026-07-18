
import { useState } from "react";
import {
  FaThumbsUp,
  FaComment,
  FaShareAlt,
  FaPenNib,
  FaTrash,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import CommentSection from "./CommentSection";
import { useDispatch } from "react-redux";
import {
  deletePost,
  fetchPosts,
  likePost,
  updatePost,
} from "../reducers/postReducer";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import imageUrl from "../utils/imageUrl";

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [showShareModal, setShowShareModal] = useState(false);
  const currentURL = `${window.location.origin}/#${post._id}`;

  const { getUser } = useAuth();
  const dispatch = useDispatch();
  const handlEdit = () => {
    setShowEditModal(true);
    setEditedContent(post.content);
  };
 const handleUpdate = async () => {
  try {
    await dispatch(
      updatePost({
        postId: post._id,
        postData: { content: editedContent },
      })
    ).unwrap();

    setShowEditModal(false);
  } catch (err) {
    console.error(err);
  }
};
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentURL);
    alert("Link copied to clipboard!");
  };
 
  return (
    <div className="card mb-4 shadow rounded-4 border-0" id={post._id}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between ">
          <div className="d-flex justify-content-start align-items-center gap-2">
            <div className="">
              <img
                src={
                  imageUrl( post.postedBy.profileImage || "default.jpg")
                }
                alt="profile"
                className="rounded-circle"
                style={{ width: "30px", height: "30px", objectFit: "cover" }}
              />
            </div>
            <div>
              <Link
                to={`/profile/${post.postedBy._id}`}
                className="cursor-pointer "
                style={{ textDecoration: "none" }}
              >
                {post.postedBy.username}
              </Link>

              <small className="ms-2 text-muted">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </small>
            </div>
          </div>
          {getUser()._id === post.postedBy._id && (
            <div className="dropdown">
              <button
                className="btn"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >:</button>
              <ul
                className="dropdown-menu "
                aria-labelledby="dropdownMenuButton"
              >
                <li>
                  <button className="dropdown-item" onClick={handlEdit}>
                    <FaPenNib /> Edit
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => dispatch(deletePost(post._id))}
                  >
                    <FaTrash /> Delete
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        {post.image && (
          <div className="text-center mb-3 mt-3">
            <img
              src={imageUrl(post.image)}
              alt="post image"
              className="img-fluid rounded"
              style={{ 
                width: "100%",
                height: "260px",
                objectFit: "cover",
               }}
            />
          </div>
        )}
        <p className="mt-3 mb-3 fs-6">{post.content}</p>
        <div className="d-flex flex-wrap gap-2">
          <button
            className={`btn rounded-pill px-3 ${post.hasLiked ? "btn-primary" : "btn-outline-primary"}`}

            onClick={() => dispatch(likePost(post._id))}
          >
            <FaThumbsUp color={post.hasLiked ? "blue" : "black"} />{" "}
            {post.likesCount}
          </button>
          <button
            className={`btn rounded-pill px-3 ${showComments ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setShowComments(!showComments)}
          >
            <FaComment color={showComments ? "blue" : "black"} />{" "}
            {post.comments.length}
          </button>
          <button className="btn btn-outline-secondary rounded-pill px-3" onClick={() => setShowShareModal((prev) => !prev)}>
            <FaShareAlt  /> 
          </button>{" "}
        </div>
        <div className="mt-3">
        {showComments && (
          <CommentSection postId={post._id} comments={post.comments} />
        )}
        </div>
      </div>

      <div
        className={`modal fade ${showEditModal ? "show d-block" : ""}`}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Post</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowEditModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <textarea
                className="form-control"
                rows="3"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal fade ${showShareModal ? "show d-block" : ""}`}
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Share Post</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowShareModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                value={currentURL}
                readOnly
              />
              <button
                className="btn btn-primary mt-3"
                onClick={copyToClipboard}
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
      {showShareModal && <div className="modal-backdrop fade show"></div>}

      {showEditModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default PostCard;
