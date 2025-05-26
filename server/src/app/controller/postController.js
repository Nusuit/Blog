const { v4: uuidv4} = require('uuid');
const { checkRecordExist, insertRecord, createTable, updateRecord, deleteRecord, getRecords, getRecordsByUserIds} = require('../../utils/sqlFunction');
const blogSchema = require('../../schemas/blogSchema');
const authenticateToken = require('../middleware/authenticateToken');

const postBlog = async (req, res) => {
    const { title, content, reaction, comment } = req.body;
    const userId = req.user.userId;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    try {
        await createTable(blogSchema);
        const blog = {
            blogId: uuidv4(),
            title,
            content,
            comment,
            userId,
            reaction
        };
        const result = await insertRecord('blogs', blog);
        res.status(201).json(result);
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const editBlog = async (req, res) => {
    const { blogId, title, content, reaction } = req.body;
    const userId = req.user.userId;

    if (!blogId || !title || !content) {
        return res.status(400).json({ message: 'Blog ID, title, and content are required' });
    }

    try {
        const blog = await checkRecordExist('blogs', 'blogId', blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.userId !== userId) {
            return res.status(403).json({ message: 'You are not authorized to edit this blog' });
        }

        await updateRecord('blogs', { title, content, reaction }, 'blogId', blogId);
        res.status(200).json({ message: 'Blog updated successfully' });
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteBlog = async (req, res) => {
    const { blogId } = req.body;
    const userId = req.user.userId;

    if (!blogId) {
        return res.status(400).json({ message: 'Blog ID is required' });
    }

    try {
        const blog = await checkRecordExist('blogs', 'blogId', blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.userId !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this blog' });
        }

        await deleteRecord('blogs', 'blogId', blogId);
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getBlogs = async (req, res) => {
    const userId = req.user.userId;

    try {
        const friends = await getFriends(userId);
        const friendIds = friends.map(friend => friend.friendId);
        friendIds.push(userId); // Include the user's own blogs

        const blogs = await getBlogsByUserIds(friendIds);
        res.status(200).json(blogs);
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getFriends = async (userId) => {
    // Implement a function to get friends of the user
    return await getRecords('friendships', 'userId', userId);
};

const getBlogsByUserIds = async (userIds) => {
    // Implement a function to get blogs by user IDs
    return await getRecordsByUserIds('blogs', 'userId', userIds);
};

module.exports = { postBlog, editBlog, deleteBlog, getBlogs };