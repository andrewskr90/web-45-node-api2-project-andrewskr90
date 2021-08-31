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
            .then(id => {
                // res.status(201)
                //     .json(post)
                Post.findById(id)
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

router.put('/:id', (req, res) => {
    const { id } = req.params
    const post = req.body
    console.log(post)
    if (!post.title || !post.contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" })
    }
    Post.update(id, post)
        .then(newPost => {
            if (!newPost) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                res.status(200).json(post)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            })
        })
})



module.exports = router