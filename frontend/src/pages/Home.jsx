import { useEffect } from "react";
import CreatePostForm from "../components/CreatePostForm";
import PostCard from "../components/PostCard";
import Sidebar from "../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../reducers/postReducer";
import RightSidebar from "../components/RightSidebar";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, error } = useSelector(
    (state) => state.post
  );

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (error) {
     return (
        <div className="container mt-5 text-center">
             <p className="text-danger">{error}</p>
        </div>
       );
  }

  return (
    <main className="container mt-4">
      <div className="row justify-content-center">
        {/* Left Sidebar */}
        <div className="col-lg-3 d-none d-lg-block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="col-lg-6 col-md-8">
          {/* Create Post Form */}
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <CreatePostForm />
            </div>
          </div>

          {/* Feed */}
        
          {isLoading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            ) : posts.length === 0 ? (
                <p className="text-center text-muted mt-4">
                  No posts yet. Be the first to create one!
            </p>
          ) : (
            posts.map((post) => (
                <PostCard 
                key={post._id}
                post={post} />
            ))
          )}
        </div>

        <RightSidebar />
      </div>
    </main>
  );
};

export default Home;
