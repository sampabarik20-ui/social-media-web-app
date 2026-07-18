import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({

    profileImage: { 
        type: String, 
        required:false,
        default: "default.jpg",
    },
    coverImage: { 
        type: String, 
        required:false,
        default: "https://placehold.co/350"
    },
    bio: { 
        type: String, 
    },
    username: { 
        type: String, 
        required:true,
        unique: true,
        trim: true,
    },
    email: { 
        type: String, 
        required:true,
        unique: true,
        trim: true,
    },
    password: { 
        type: String, 
        required:true,
    },
    following: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",
             default: [],
         },
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
     ],

    posts: [
        {
             type: mongoose.Schema.Types.ObjectId, 
             ref: "Post", 
             default: [] ,
        }
    ],
    createdAt: { 
        type: Date, 
        default: Date.now, 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now, 
    },
});


userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
       return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
});

export default mongoose.model("User",userSchema);