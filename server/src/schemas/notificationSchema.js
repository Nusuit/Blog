const notificationSchema = `
  CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    senderId VARCHAR(255) NOT NULL,
    receiverId VARCHAR(255) NOT NULL, 
    status VARCHAR(20) DEFAULT 'unread',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (senderId) REFERENCES users(userId),
    FOREIGN KEY (receiverId) REFERENCES users(userId)
  )
`;

module.exports = notificationSchema;