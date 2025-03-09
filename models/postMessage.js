import mongoose from 'mongoose';
// we imported mongoose above 
// creating schema for posts
const postSchema = mongoose.Schema({
    title : String,
    message : String,
    name : String,
    creator : String,
    tags : [String],
    selectedFile : String,
    likes : {
        type : [String],
        default : [],
    },
    comments : {
        type : [String],
        default : [],
    },
    createdAt : {
        type : Date,
        default : new Date()
    }
});

//Now here we are converting schema into a model
const postMessage = mongoose.model('postMessage',postSchema);

//exporting the model
export default postMessage;