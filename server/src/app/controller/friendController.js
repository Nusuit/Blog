const { v4: uuidv4 } = require('uuid');
const { checkRecordExist, insertRecord, deleteRecord, createTable, executeQuery } = require('../../utils/sqlFunction');
const friendshipSchema = require('../../schemas/friendShipSchema');
const notificationSchema = require('../../schemas/notificationSchema');

const addFriend = async (req, res) => {
    const { friendId } = req.body;
    const userId = req.user.userId;

    if (!friendId) {
        return res.status(400).json({ message: 'Friend ID is required' });
    }

    try {
        // Tạo request kết bạn
        await createTable(friendshipSchema);
        await createTable(notificationSchema);

        // Tạo thông báo cho người nhận
        await insertRecord('notifications', {
            id: uuidv4(),
            type: 'friend_request',
            senderId: userId,
            receiverId: friendId,
            status: 'pending'
        });

        res.status(201).json({ message: 'Friend request sent' });
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const acceptFriend = async (req, res) => {
    const { friendId } = req.body;
    const userId = req.user.userId;

    try {
        // Kiểm tra request tồn tại
        const notification = await checkRecordExist('notifications', 'senderId', friendId);
        if (!notification || notification.status !== 'pending') {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        // Tạo friendship
        const friendship = {
            friendshipId: uuidv4(),
            userId,
            friendId,
            friendCount: 1
        };
        await insertRecord('friendships', friendship);

        // Cập nhật notification status
        await executeQuery(
            'UPDATE notifications SET status = ? WHERE senderId = ? AND receiverId = ?',
            ['accepted', friendId, userId]
        );

        // Tạo thông báo accept cho người gửi
        await insertRecord('notifications', {
            id: uuidv4(),
            type: 'friend_accept',
            senderId: userId,
            receiverId: friendId,
            status: 'unread'
        });

        // Cập nhật friend count
        await executeQuery('UPDATE users SET friendCount = friendCount + 1 WHERE userId IN (?, ?)', 
            [userId, friendId]
        );

        res.status(200).json({ message: 'Friend request accepted' });
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const removeFriend = async (req, res) => {
    const { friendId } = req.body;
    const userId = req.user.userId;

    if (!friendId) {
        return res.status(400).json({ message: 'Friend ID is required' });
    }

    try {
        const friendship = await executeQuery(
            'SELECT * FROM friendships WHERE (userId = ? AND friendId = ?) OR (userId = ? AND friendId = ?)',
            [userId, friendId, friendId, userId]
        );

        if (!friendship || friendship.length === 0) {
            return res.status(404).json({ message: 'Friendship not found' });
        }

        // Xóa friendship
        await executeQuery(
            'DELETE FROM friendships WHERE (userId = ? AND friendId = ?) OR (userId = ? AND friendId = ?)',
            [userId, friendId, friendId, userId]
        );

        // Cập nhật friend count
        await executeQuery(
            'UPDATE users SET friendCount = friendCount - 1 WHERE userId IN (?, ?)',
            [userId, friendId]
        );

        // Tạo thông báo unfriend
        await insertRecord('notifications', {
            id: uuidv4(),
            type: 'friend_remove',
            senderId: userId,
            receiverId: friendId,
            status: 'unread'
        });

        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const declineFriend = async (req, res) => {
    const { friendId } = req.body;
    const userId = req.user.userId;

    try {
        await executeQuery(
            'UPDATE notifications SET status = ? WHERE senderId = ? AND receiverId = ?',
            ['declined', friendId, userId]
        );

        res.status(200).json({ message: 'Friend request declined' });
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' }); 
    }
};

const getNotifications = async (req, res) => {
    const userId = req.user.userId;
    try {
        const notifications = await executeQuery(
            `SELECT n.*, u.name, u.avatar 
             FROM notifications n 
             JOIN users u ON n.senderId = u.userId 
             WHERE n.receiverId = ? 
             ORDER BY n.createdAt DESC`,
            [userId]
        );
        res.json(notifications);
    } catch (e) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getFriendSuggestions = async (req, res) => {
    const userId = req.user.userId;
    try {
        // Lấy danh sách users khác (không bao gồm current user)
        // và không bao gồm những người đã là bạn bè hoặc đã gửi/nhận lời mời kết bạn
        const suggestions = await executeQuery(`
            SELECT DISTINCT u.userId, u.name, u.avatar 
            FROM users u
            WHERE u.userId != ?
            AND u.userId NOT IN (
                -- Loại trừ những người đã là bạn bè
                SELECT friendId FROM friendships 
                WHERE userId = ?
                UNION
                SELECT userId FROM friendships 
                WHERE friendId = ?
                UNION
                -- Loại trừ những người đã gửi/nhận friend request
                SELECT receiverId FROM notifications 
                WHERE senderId = ? AND type = 'friend_request'
                UNION
                SELECT senderId FROM notifications 
                WHERE receiverId = ? AND type = 'friend_request'
            )
            LIMIT 10
        `, [userId, userId, userId, userId, userId]);

        console.log('Suggestions found:', suggestions); // Debug log
        res.json(suggestions);
    } catch (error) {
        console.error('Error in getFriendSuggestions:', error); // Debug log
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

const checkFriendStatus = async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user.userId;
    
    try {
        const friendship = await executeQuery(
            `SELECT * FROM friendships 
             WHERE (userId = ? AND friendId = ?) 
             OR (userId = ? AND friendId = ?)`,
            [currentUserId, userId, userId, currentUserId]
        );

        if (friendship.length > 0) {
            return res.json({ status: 'friends' });
        }

        const pendingRequest = await executeQuery(
            `SELECT * FROM notifications 
             WHERE type = 'friend_request' 
             AND ((senderId = ? AND receiverId = ?) 
             OR (senderId = ? AND receiverId = ?))
             AND status = 'pending'`,
            [currentUserId, userId, userId, currentUserId]
        );

        if (pendingRequest.length > 0) {
            if (pendingRequest[0].senderId === currentUserId) {
                return res.json({ status: 'pending' });
            } else {
                return res.json({ status: 'received' });
            }
        }

        res.json({ status: 'none' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
const getFriendsList = async (req, res) => {
    const userId = req.user.userId;
    try {
      const friends = await executeQuery(`
        SELECT u.userId, u.name, u.avatar,
          (SELECT COUNT(*) FROM friendships f2
           WHERE ((f2.userId = f1.friendId AND f2.friendId IN 
             (SELECT friendId FROM friendships WHERE userId = ?))
             OR (f2.friendId = f1.friendId AND f2.userId IN 
             (SELECT friendId FROM friendships WHERE userId = ?)))
          ) as mutualFriends
        FROM friendships f1
        JOIN users u ON f1.friendId = u.userId
        WHERE f1.userId = ?
      `, [userId, userId, userId]);
      
      res.json(friends);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  const getRequests = async (req, res) => {
    const userId = req.user.userId;
    try {
        const requests = await executeQuery(`
            SELECT u.userId, u.name, u.avatar
            FROM notifications n
            INNER JOIN users u ON n.senderId = u.userId
            WHERE n.receiverId = ?
            AND n.type = 'friend_request'
            AND n.status = 'pending'
        `, [userId]);
        
        res.json(requests);
    } catch (error) {
        console.error('Error in getRequests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
  
module.exports = {
    addFriend,
    removeFriend,
    acceptFriend,
    declineFriend,
    getNotifications,
    getFriendSuggestions,
    checkFriendStatus,
    getFriendsList,
    getRequests
};