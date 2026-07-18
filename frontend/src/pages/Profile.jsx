import React, { useEffect } from "react";
import { useParams } from "react-router";
import PostCard from "../components/PostCard";
import { FaUserFriends } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleFollow, fetchProfile } from "../reducers/profileReducer";
import { Link } from "react-router-dom";
import imageUrl from "../utils/imageUrl";


const Profile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  
  const { data: userProfile, loading } = useSelector((state) => state.profile);
  useEffect(() => {
    dispatch(fetchProfile(id));
  }, [id, dispatch]);
  if (loading || !userProfile) {
    return <div className="text-center mt-5">Loading...</div>;
  }
  
  const handleFollow = () => {
    dispatch(toggleFollow(id));
  };

  
  
  return (
    <div className="container mt-4">
      <div className="card">
        {/* Cover Image Section */}
        <div className="position-relative">
          <img
            src={
                userProfile.coverImage
               ? userProfile.coverImage.startsWith("http")
               ? userProfile.coverImage
               : imageUrl(userProfile.coverImage)
               : "https://placehold.co/1200x300?text=Cover+Image"
               }
              className="img-fluid w-100 cover-image"
              alt="Cover"
              style={{ 
                maxHeight: "300px", 
                height: "220px",
                objectFit: "cover",
              }}
          />
          {/* Profile Picture */}
          <img
            src={
              userProfile.profileImage
                ? imageUrl(userProfile.profileImage)
                : "https://placehold.co/150"
            }
            alt="Profile"
            className="rounded-circle position-absolute"
            style={{
              width: "120px",
              height: "120px",
              bottom: "-60px",
              left: "50%",
              border: "5px solid white",
              transform: "translateX(-50%)",
              objectFit: "cover",
            }}
          />
        </div>
        {/* Profile Details */}
        <div className="card-body pt-4 mt-md-5 px-3 px-md-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center align-items-md-end text-center text-md-start">
            <div className="text-center text-md-start">
              <h3 className="fw-bold mt-5">{userProfile.username}</h3>
              <p className="text-muted mb-0">
                {userProfile.bio || "No bio available"}
              </p>
            </div>
            <div>
              {userProfile.isMe ? (
                <Link className="btn btn-primary px-4 mt-3 mt-md-0" to="/profile/update">
                  Edit Profile
                </Link>
              ) : (
                <button
                  className={`btn ${
                    userProfile.isFollowing
                      ? "btn-outline-primary"
                      : "btn-primary"
                  } mt-3 mt-md-0`}
                  onClick={handleFollow}
                >
                  {userProfile.isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          </div>
          {/* Profile Statistics */}
          <div className="row text-center mt-4 gy-3">
            <div className="col-4">
              <h5>{userProfile.followers?.length || 0}</h5>
              <small>Followers</small>
            </div>
            <div className="col-4">
              <h5>{userProfile.following?.length || 0}</h5>
              <small>Following</small>
            </div>
            <div className="col-4">
              <h5>{userProfile.posts?.length || 0}</h5>
              <small>Posts</small>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-4 mt-md-5">
        <div className="row mt-5">
          
          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <h4 className="mb-3 text-success fw-bold d-flex align-items-center">
              <FaUserFriends className="me-2" /> Following
            </h4>
            <div className="list-group shadow-sm rounded p-2">
              {userProfile?.following?.length > 0 ? (
                userProfile.following?.map((user, index) => (
                 <Link
                    key={user._id}
                    to={`/profile/${user._id}`}
                     className="list-group-item list-group-item-action d-flex align-items-center border-0 text-decoration-none">
                    <img
                      src={imageUrl(user.profileImage)}
                      alt="Profile"
                      className="rounded-circle me-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                    <span className="fw-semibold text-dark">
                      {user.username}
                    </span>
                  </Link>
                ))
              ) : (
                <div className=" text-center text-muted p-2">
                  <FaUserFriends size={28} />
                  <p  className="mt-2 mb-0"> No followers yet</p>
                </div>
              )}
            </div>
          </div>

            {/* Followers */}
            <div className="col-12 col-md-6 col-lg-3 mb-4">
                  <h4 className="mb-3 text-primary fw-bold d-flex align-items-center">
                   <FaUserFriends className="me-2" /> Followers
                  </h4>

                  <div className="list-group shadow-sm rounded p-2">
                     {userProfile?.followers?.length > 0 ? (
                     userProfile.followers.map((user) => (
                     <Link
                        key={user._id}
                        to={`/profile/${user._id}`}
                        className="list-group-item list-group-item-action d-flex align-items-center border-0 text-decoration-none"
                     >
                       <img
                        src={imageUrl(user.profileImage)}
                        alt="Profile"
                        className="rounded-circle me-3"
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      />
                        <span>{user.username}</span>
                     </Link>
                     ))
                     ) : (
                        <p className="text-muted p-2">No followers yet</p>
                      )}
                   </div>
             </div>

           {/* User Posts */}
          <div className="col-12 col-lg-6 mb-4">
            <h4 className="mb-3  fw-bold">Posts</h4>
            {userProfile?.posts?.length > 0 ? (
              userProfile.posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <p className="text-muted">No posts yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
