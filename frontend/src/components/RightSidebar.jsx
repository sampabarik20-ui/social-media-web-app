import  { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router";
import imageUrl from "../utils/imageUrl";

const RightSidebar = () => {
  const [followers, setFollowers] = useState([]);
  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await api.get(
          "users/followers"
        );
        const data = await response.data;
        setFollowers(data);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };
    fetchFollowers();
  }, []);
  
  return (
    <div className="col-lg-3 d-none d-lg-block">
      {/* Suggestions / Ads / Trending Topics */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Your Followers</h5>
          {followers.length === 0 ? (
            <p className="text-muted">No followers yet.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {followers
                 .filter((follower) => follower.followerId)
                 .map((follower) =>  (
                <li
                  key={follower.followerId._id}
                  className="list-group-item d-flex align-items-center"
                >
                  <img
                    src={imageUrl(follower.followerId.profileImage)}
                    alt={`${follower.followerId.username}'s profile`}
                    className="rounded-circle me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <Link
                      to={`/profile/${follower.followerId._id}`}
                      className="text-decoration-none fw-bold text-primary"
                    >
                      {follower.followerId.username}
                    </Link>
                    {follower.followerId.bio && (
                        <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
                          {follower.followerId.bio.length > 30
                            ? `${follower.followerId.bio.slice(0, 30)}...`
                            : follower.followerId.bio}
                        </p>
                      )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
