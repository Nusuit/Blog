// Creating user table
const userSchema = `
  CREATE TABLE IF NOT EXISTS users (
      userId VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      newPassword VARCHAR(255),
      name VARCHAR(255) NOT NULL,
      avatar VARCHAR(255),
      otp VARCHAR(6),
      otpExpiry BIGINT,
      avatar VARCHAR(255),
      Primary Key (userId),
      resetToken VARCHAR(255),
      isVerified BOOLEAN DEFAULT false,
      resetTokenExpiry BIGINT
  )
`;

module.exports = userSchema;