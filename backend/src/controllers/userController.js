import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Follower from "../models/Follower.js";
import Post from "../models/Post.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: "User registered succesfully" });
  } catch (err) {
    res.status(500);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); 
    if (!user || !(await bcrypt.compare(password, user.password))) {
     
      return res.json({ message: "Invalid Credentials" });
    }
   
    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        profileImage: user.profileImage || null,
        coverImage: user.coverImage || " ",
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    // return the json web token
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const verify = async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "You are not authenticated" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json(decoded);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    // Support both old JWT (id) and new JWT (_id)
    const userId = req.user._id || req.user.id;

    if (!userId) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("getCurrentUser Error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
export const profile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select("-password")
      .populate("following", "_id username profileImage")
      .populate("followers", "_id username profileImage");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const posts = await Post.find({ postedBy: userId })
      .populate("postedBy", "username profileImage")
      .populate("comments.commentedBy", "username")
      .populate("likes");

   
    const postsWithLikes = posts.map((post) => ({
      ...post.toObject(),
      likesCount: post.likes.length,
      hasLiked: req.user
        ? post.likes.some((like) => like.userId.toString() === req.user._id)
        : false,
    }));

    const isFollowing = !!(await Follower.findOne({
      followerId: req.user._id,
      followingId: userId,
    }));

    res.status(200).json({
      ...user.toObject(),
      posts: postsWithLikes,
      followers: user.followers,
      isFollowing,
      isMe: req.user ? req.user._id === userId : false,
    });
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio;
    if (req.files && req.files.profileImage) {
      user.profileImage = req.files.profileImage[0].filename;
    }
    if (req.files && req.files.coverImage) {
      user.coverImage = req.files.coverImage[0].filename;
    }
    await user.save();
    res.status(201).json(user);
  } catch (err) {
  console.error(err);
      res.status(500).json(
      { message: "Server error" });
   }
 };
export const getFollowers = async(req,res) => {
  try {
    const followers = await Follower.find({ followingId: req.user._id }) 
    .populate("followerId", "_id username profileImage bio") 
    .lean();
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export const followUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUser = req.user._id;

    if (userId === currentUser) {
      return res.status(400).json({ 
        message: "You cannot follow yourself"
       });
    }
    const existingFollow = await Follower.findOne({
      followerId: currentUser,
      followingId: userId,
    });
    if (existingFollow) {
      //remove follow 
      await Follower.findOneAndDelete({
        followerId: currentUser,
        followingId: userId,
      });
      //remove from current user's following
      await User.findByIdAndUpdate(currentUser, {
        $pull: { following: userId },
      });

      console.log("User unfollowed successfully");
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: currentUser },
      });

      return res.status(200).json({
        message: "User unfollowed successfully",
      });
    } else {
      //create follow
      await Follower.create({
        followerId: currentUser,
        followingId: userId,
      });
      //add current user following
      await User.findByIdAndUpdate(currentUser, {
        $addToSet: { following: userId },
      });

      await User.findByIdAndUpdate(userId, {
      $addToSet: { followers: currentUser },
    });

      return res.status(201).json({
        message: "User followed successfully",
        userId: userId,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Server error" 
    });
  }
};
