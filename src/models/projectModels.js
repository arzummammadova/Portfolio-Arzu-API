import mongoose from "mongoose";

const projectSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    githubLink:{
        type:String,
        required:true
    },
    liveLink:{
        type:String,
        required:false
    },
    figmaLink:{
        type:String,
        required:false
    },
    technologies:{
        type:[String],
        required:true
    },
    video:{
        type:String,
        required:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

},{timestamps:true})

const Project=mongoose.model("Project",projectSchema);
export default Project;