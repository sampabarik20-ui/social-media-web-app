import React, { useCallback, useEffect, useState } from "react";
import api from "../api";
import { debounce } from "lodash";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import imageUrl from "../utils/imageUrl";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Fetch Search Results
  const fetchSearchResult = useCallback(
    debounce(async (searchTerm) => {
      if (!searchTerm.trim()) {
        setResults({ users: [], posts: [] });
        setLoading(false);
        setShowResults(false);
        return;
      }
      setLoading(true);
      try {
        const { data } = await api.get(
          `search?query=${searchTerm}`,);
        setResults(data);
        setShowResults(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 1000),
    []
  );

  useEffect(() => {
    fetchSearchResult(query);
    // return () => fetchSearchResult.cancel();
  }, [query, fetchSearchResult]);

  return (
    <div className="position-relative mt-3">
      {/* Search Input */}
      <div className="input-group mb-2">
        <span className="input-group-text bg-primary text-white border-0">
          <FaSearch />
        </span>

        <input
          type="text"
          className="form-control border-primary rounded-end"
          placeholder="Search users or posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => {}}
        />
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div
          className="position-absolute shadow p-2 bg-white rounded w-100"
          style={{
               position: "absolute",
               top: "100%",
               left: 0,
               right: 0,
               maxHeight: "300px",
               overflowY: "auto",
              zIndex: 9999,
          }}
        >
          {loading && <p className="text-muted text-center">Loading...</p>}

          {/* Display Users */}
          {results.users.length > 0 && (
            <div>
              <h6 className="text-primary">Users</h6>
              {results.users.map((user) => (
                <div
                  key={user._id}
                  className="d-flex align-items-center p-2 border-bottom"
                >
                  <img
                    src={imageUrl(user.profileImage)}
                    alt="Profile"
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                  <Link
                    to={`/profile/${user._id}`}
                    className="text-decoration-none ms-2 text-primary"
                    onClick={() => {
                         setQuery("");
                         setShowResults(false);
                     }}
                   >
                    <div>
                      <span className="fw-bold">{user.username}</span>
                      <small className="text-muted d-block">{user.bio?.slice(0, 40)}</small>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Display Posts */}
          {results.posts.length > 0 && (
            <div className="mt-2">
              <h6 className="text-primary">Posts</h6>
              {results.posts.map((post) => (
                <div key={post._id} className="p-2 border-bottom"
                      onClick={() => {
                          setQuery("");
                          setShowResults(false);
                       }}
                >
                  <h6 className="mb-1">{post.title}</h6>
                  <p className="text-muted">
                    {post.content.substring(0, 80)}...
                  </p>
                  <small className="text-muted">
                    By {post.postedBy.username}
                  </small>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {results.users.length === 0 &&
            results.posts.length === 0 &&
            !loading && (
              <p className="text-muted text-center">No results found</p>
            )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
