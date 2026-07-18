import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => { 
  const response = await api.get("posts");
  return response.data;
 
});

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    console.log(postId);
    try {
      await api.delete(`posts/delete/${postId}`);
      return postId;
    }catch(error){
      return rejectWithValue(error.response.data);
    }
   
  }
);
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.get(`posts/like/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data ||{
        message: "Something went wrong",
      });
    }
  }
);
export const addPost = createAsyncThunk(
  "posts/addPost",
  async (postData, { rejectWithValue }) => {
    try {
      const response = await api.post("posts/create", postData);
     
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`posts/edit/${postId}`, postData);
     
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const initialState = {
  posts: [],
  isLoading: false,
  error: null,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts = [action.payload, ...state.posts];
      })
      .addCase(addPost.rejected, (state, action) => {
        state.error = action.payload;
        console.error(action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;

        const index = state.posts.findIndex(
        post => post._id === action.payload._id
        );
        if (index !== -1) {
        state.posts[index] = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, likesCount, hasLiked } = action.payload;
        
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.likesCount = likesCount;
          post.hasLiked = hasLiked;
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.error.message;
        console.error(action.error.message);
      });
  },
});

export default postSlice.reducer;
