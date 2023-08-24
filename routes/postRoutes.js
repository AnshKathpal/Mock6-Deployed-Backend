const express = require("express");
const postRoute = express.Router();
const User = require("../models/userModel");
const Post = require("../models/postModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const middleware = require("../middleware/auth")

postRoute.post("/blogs", async (req, res) => {
  try {
    const {title, content, category, date} = req.body;


    const post = new Post.postModel({
        username : req.username,
        title,
        content,
        category,
        date,
        creator : req.userId
    })
    await post.save();
    return res.status(200).send(post);

  } catch (error) {

    console.log(error)
    res.status(404).end(error.message)

  }
});


postRoute.get("/blogs",  async (req, res) => {
  const { title, sort } = req.query;

  try {
    let search = {};

    if (title) {
      search.title = { $regex: title, $options: "i" };
    }

    let sortCriteria = {};

    if (sort === "asc") {
      sortCriteria.date = 1;
    } else if (sort === "desc") {
      sortCriteria.date = -1;
    }

    const posts = await Post.postModel.find(search).sort(sortCriteria);
    res.status(200).send(posts);
  } catch (error) {
    console.log(error.message);
    res.status(400).end(error.message);
  }
});


postRoute.patch("/blogs/:postId", middleware, async(req,res) => {

  try {
    const post = await Post.postModel.findById(req.params.postId);
    if(post.creator.toString() !== req.userId) {
      res.send("Not Allowed to update")
    }else{
      const updatePost = await Post.postModel.findByIdAndUpdate(req.params.postId,req.body,{
        new : true
      })
      res.send(updatePost)
    }
  } catch (error) {
    console.log(error.message);
    res.status(404).end(error.message)
  }


})


postRoute.delete("/blogs/:postId", middleware, async(req,res) => {

  try {
    const post = await Post.postModel.findById(req.params.postId);
    if(post.creator.toString() !== req.userId) {
      res.send("Not Allowed to update")
    }else{
      const deletedPost = await Post.postModel.findByIdAndDelete(req.params.postId,req.body,{
        new : true
      })
      res.send(deletedPost)
    }
  } catch (error) {
    console.log(error.message);
    res.status(404).end(error.message)
  }


})
postRoute.patch("/blogs/:postId/like", middleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    const index = post.likes.findIndex((id) => id === String(req.userId)); 
    if (index == -1) {
      post.likes.push(req.userId); 
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId)); 
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, post, {
      new: true,
    });

    res.send(updatedPost);
  } catch (error) {
    console.log(error.message);
    res.status(404).end(error);
  }
});



module.exports = {
    postRoute 
}
