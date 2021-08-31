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

module.exports = router