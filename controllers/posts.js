import postMessage from "../models/postMessage.js";
import mongoose from 'mongoose';
// Logic to get all posts
export const getPosts = async(req,res) =>{
    const { page } = req.query;
    try{
        const LIMIT = 8;
        const startIndex = (Number(page)-1)*LIMIT; //get the  starting index of every page
        const total = await postMessage.countDocuments({});

        const posts = await postMessage.find().sort({ _id: -1}).limit(LIMIT).skip(startIndex);
        // console.log(postMessages)
        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT)}); // we are sending response as we got success
    }catch(error){
        // we also need to send some response when we got error
        res.status(404).json({message : error.message});
    }
}
//Query -> /posts?page=1 -> page=1
//Params -> /posts/1234 -> id = 1234

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    let queryConditions = [];

    // Add title condition only if searchQuery is provided and not empty
    if (searchQuery?.trim()) {
      const title = new RegExp(searchQuery.trim(), "i");
      queryConditions.push({ title });
    }

    // Add tags condition only if tags are provided
    if (tags) {
      queryConditions.push({ tags: { $in: tags.split(",") } });
    }

    // Query only if conditions exist; otherwise, return empty array
    const posts = await postMessage.find(
      queryConditions.length > 0 ? { $or: queryConditions } : { _id: null } // Prevents returning all posts
    );

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getPost = async(req, res) =>{
  const { id } = req.params;
  try{
    const post = await postMessage.findById(id);
    res.status(200).json(post);
  }catch(error){
    res.status(404).json({ message: error.message })
  }
}
//Logic to create a post
export const createPost = async (req,res) =>{
    const post = req.body;
    const newPost = new postMessage({...post,creator: req.userId,createdAt: new Date().toISOString()});
    try{
        await newPost.save();
        res.status(201).json(newPost);
    }catch(error){
        res.status(409).json({ message : error.message });
    }
}
// UPDATE POSTS
export const updatePost = async(req,res) => {
    const { id:_id } = req.params;
    const post = req.body;
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id')
    const updatedPost = await postMessage.findByIdAndUpdate(_id , {...post,_id} , {new : true});
    res.json(updatedPost);
}
//Delete POSTS
export const deletePost = async(req,res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id')
    await postMessage.findByIdAndDelete(id);
    res.json({message:'Post deleted successfully'})
}

export const likePost = async(req,res)=>{
    const { id } = req.params;
    if (!req.userId)
      return res.status(401).json({ message: "Unauthenticated" });
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');
    const post = await postMessage.findById(id);
    const index = post.likes.findIndex((id) => id === String(req.userId));
    if(index === -1){
        post.likes.push(req.userId);
    }else{
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await postMessage.findByIdAndUpdate(id,post,{new:true})
    res.json(updatedPost);
}
export const commentPost = async(req, res) =>{
  const { id } = req.params;
  const { value } = req.body;

  const post = await postMessage.findById(id);

  post.comments.push(value);

  const updatedPost = await postMessage.findByIdAndUpdate(id, post, { new: true});

  res.json(updatedPost);
}