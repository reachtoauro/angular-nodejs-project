const express = require('express');
const PostController = require('../controllers/post')

const router = express.Router();

const extractFile = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

router.post('', checkAuth, extractFile, PostController.savePost);
router.put('/:id', checkAuth, extractFile, PostController.updatePost)
router.get('', PostController.getPosts);
router.get('/:id', PostController.getPost)
router.delete('/:id', checkAuth, PostController.deletePost);

module.exports = router;
