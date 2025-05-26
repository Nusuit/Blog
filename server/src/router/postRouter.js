const express = require('express');
const router = express.Router();
const postController = require('../app/controller/postController');
const authenticateToken = require('../app/middleware/authenticateToken');

router.get('/blogs', authenticateToken, postController.getBlogs);
router.post('/create', authenticateToken, postController.postBlog);
router.put('/edit', authenticateToken, postController.editBlog);
router.delete('/delete', authenticateToken, postController.deleteBlog);

module.exports = router;