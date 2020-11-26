const Post = require('../models/post');


exports.savePost = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
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
            console.error(error);
            res.status(500).json({
                message: "creating a post failed"
            });
        });
};

exports.updatePost = (req, res, next) => {
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
            console.error(error);
            res.status(500).json({
                message: "unable to update post"
            });
        });
}

exports.getPosts = (req, res, next) => {
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
            console.error(error);
            res.status(500).json({
                message: "unable to fetch post"
            });
        });

}

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    })
        .catch(error => {
            console.error(error);
            res.status(500).json({
                message: "unable to fecth post"
            });
        });
}

exports.deletePost = (req, res, next) => {
    console.log(req.params.id);
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'deletion successful' });
        } else {
            res.status(401).json({ message: 'Not authorized to delete' });
        }

    })
        .catch(error => {
            console.error(error);
            res.status(500).json({
                message: "unable to delete post"
            });
        });
}



