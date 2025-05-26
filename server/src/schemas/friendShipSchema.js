const friendShipSchema =
    `CREATE TABLE IF NOT EXISTS friendships (
        friendshipId VARCHAR(255) UNIQUE NOT NULL,
        userId VARCHAR(255) NOT NULL,
        friendId VARCHAR(255) NOT NULL,
        friendCount INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (friendshipId),
        FOREIGN KEY (userId) REFERENCES users(userId),
        FOREIGN KEY (friendId) REFERENCES users(userId)
        )
    `;

module.exports = friendShipSchema;