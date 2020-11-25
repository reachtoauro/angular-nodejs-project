const express = require('express');
const Post = require('../models/post');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image.jpeg': 'jpg',
    'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Imavlid mime type');
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + ' ' + Date.now() + '.' + ext);
    }
});

router.post('', checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    //const post = req.body; 
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                ...result,
                id: result._id
            }
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "creating a post failed"
        });
    });
});

router.put('/:id', checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    var update = {
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    };
    var filter = { _id: req.params.id, creator: req.userData.userId };
    Post.findOneAndUpdate(filter, update).then(result => {
        if (result != null) {
            res.status(200).json({ message: 'Update successful' });
        } else {
            res.status(401).json({ message: 'Not authorized to update' });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "unable to update post"
        });
    });
})

router.get('', (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;
    const postQuery = Post.find();
    let fetchedPosts;

    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery
        .then((documents) => {
            fetchedPosts = documents;
            return Post.countDocuments();
        }).then(count => {
            res.status(200).json({
                message: 'Posts fetched successfully!',
                posts: fetchedPosts,
                maxPosts: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "unable to fetch post"
            });
        });

});

router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "unable to fecth post"
        });
    });
})

router.delete('/:id', checkAuth, (req, res, next) => {
    console.log(req.params.id);
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'deletion successful' });
        } else {
            res.status(401).json({ message: 'Not authorized to delete' });
        }

    })
    .catch(error => {
        res.status(500).json({
            message: "unable to delete post"
        });
    });
});

module.exports = router;