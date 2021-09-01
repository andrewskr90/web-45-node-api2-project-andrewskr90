// implement your posts router here
const express = require('express')
const Post = require('./posts-model')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const data = await Post.find()
        console.log(data)
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})

router.get('/:id', (req, res) => {
    const { id } = req.params
    Post.findById(id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
        })
        .catch(err => {
            res.status(404).json({ message: err.message })
        })
})

router.post('/', (req, res) => {
    const post = req.body
    console.log(post)
    if (!post.title || !post.contents) {
        res.status(400)
            .json({ 
                message: "Please provide title and contents for the post"
            })
    } else {
        Post.insert(post)
            .then(newPostId => {
                Post.findById(newPostId.id)
                    .then(newPost => {
                        res.status(201).json(newPost)
                    })
                    .catch(err => {
                        console.log(err.message)
                    })
            })
            .catch(err => {
                res.status(500)
                    .json({ 
                        message: err.message 
                    })
            })
        
            
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const post = req.body
    console.log(post)
    if (!post.title || !post.contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } try {
        const postId = await Post.update(id, post)
        if(!postId){
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
        const newPost = await Post.findById(postId)
        res.status(200).json(newPost)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
})

router.delete('/:id', async (req, res) => {
    // const { id } = req.params

    // try {
    //     const findId = await Post.findById(id)
    //     const deletedPost = await Post.remove(id)
    //     if (!findId) {
    //         res.status(404).json({ message: "The post with the specified ID does not exist" })
    //     }
    //     else if (deletedPost) {
    //         res.status(200).json(deletedPost)
    //     } 
    // } catch (err) {
    //     res.status(500).json({ message: "The post could not be removed" })
    // }
    const { id } = req.params;

  Post.remove(id)
    .then((deleted) => {
      if (deleted === 1) {
        res.status(200).json({ message: "The post has been deleted" });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "The post could not be removed" });
    });
})

router.get('/:id/comments', (req, res) => {
    const { id } = req.params
    Post.findPostComments(id)
        .then(comments => {
            if (comments.length > 0) {
                res.status(200).json(comments)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The comments information could not be retrieved" })
        })
})



module.exports = router