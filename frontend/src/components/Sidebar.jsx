import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuggestions, removeSuggestion } from "../reducers/suggestionsReducer";
import { toggleFollow } from "../reducers/profileReducer";
import imageUrl from "../utils/imageUrl";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { suggestions, loading, error } = useSelector(
    (state) => state.suggestions
  );

  useEffect(() => {
    dispatch(fetchSuggestions());
  }, [dispatch]);

  const handleFollow = async (id) => {
    await dispatch(toggleFollow(id));
    dispatch(removeSuggestion(id))
  }
  if (loading)
     return <div className="text-center mt-5">
      Loading...</div>;
  if (error) 
    return <div className="alert alert-danger">
      {error.message || "An error occurred"}
      </div>;


  return (
    <div className="sticky-top">
      <div className="card">
        <div className="card-body">
          <h5>Suggestions</h5>
          <ul className="list-unstyled">
            {suggestions.map((user) => (
            
              <li 
                key={user._id} 
                className="mb-2 p-2 border rounded shadow-sm"
                style={{
                  cursor: "pointer",
                  transition: "box-shadow 0.3s",
                  listStyleType: "none"
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <img
                      src={imageUrl(user.profileImage)} 
                      alt={user.username}
                      width="30"
                      height="30"
                      style={{ borderRadius: "50%", marginRight: "10px" }}
                    />
                    {user.username}
                  </div>
                  <button className="btn btn-outline-primary" 
                     onClick={() =>
                     handleFollow(user._id)}>
                     Follow
                   </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
