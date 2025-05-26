const express = require('express');
const router = express.Router();
const authenticateToken = require('../app/middleware/authenticateToken');
const friendController = require('../app/controller/friendController');

router.post('/add-friend', authenticateToken, friendController.addFriend);
router.post('/remove-friend', authenticateToken, friendController.removeFriend);
router.post('/accept-friend', authenticateToken, friendController.acceptFriend);
router.post('/decline-friend', authenticateToken, friendController.declineFriend);
router.get('/notifications', authenticateToken, friendController.getNotifications);
router.get('/suggestions', authenticateToken, friendController.getFriendSuggestions);
router.get('/check-status/:userId', authenticateToken, friendController.checkFriendStatus);
router.get('/list', authenticateToken, friendController.getFriendsList);
router.get('/requests', authenticateToken, friendController.getRequests);

module.exports = router;