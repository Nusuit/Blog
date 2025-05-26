// schemas/tagSchema.js
const tagSchema = `
  CREATE TABLE IF NOT EXISTS post_tags (
      tagId VARCHAR(255) NOT NULL,
      postId VARCHAR(255) NOT NULL,
      tagName VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (tagId),
      FOREIGN KEY (postId) REFERENCES blogs(blogId)
  )
`;

module.exports = tagSchema;