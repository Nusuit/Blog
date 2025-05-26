const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const userSchema = require('../../schemas/userSchema');
const {createTable, checkRecordExist, insertRecord, updateRecord} = require('../../utils/sqlFunction');

// Utility functions
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const createEmailTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

const sendOTP = async (email, otp) => { // Bỏ tham số res
  console.log('Attempting to send email with:', {
      from: process.env.EMAIL,
      to: email
  });

  const transporter = createEmailTransporter();
  const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
  };

  try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info);
      return true;
  } catch (error) {
      console.error("Email sending error:", error);
      return false;
  }
};

const register = async (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name fields cannot be empty!" });
  }

  try {
      await createTable(userSchema);
      const userExists = await checkRecordExist("users", "email", email);
      
      if (userExists) {
          return res.status(409).json({ error: "Email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = {
          userId: uuidv4(),
          email,
          password: hashedPassword,
          name,
          isVerified: true // Tạm thời bỏ qua xác thực email
      };

      await insertRecord("users", user);
      
      return res.status(201).json({ 
          message: "Account created successfully",
          success: true
      });

  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
};

// Sửa lại hàm verifyOTP
const verifyOTP = async (req, res) => {
  const {email, otp} = req.body;
  
  if (!email || !otp) {
      return res.status(400).json({error: "Email and OTP fields cannot be empty!"});
  }

  try {
      const user = await checkRecordExist('users', 'email', email);
      
      if (!user) {
          return res.status(404).json({error: 'User not found!'});
      }

      // Kiểm tra OTP và thời gian hết hạn
      if (user.otp != otp) {
          return res.status(401).json({error: 'Invalid OTP!'});
      }

      if (user.otpExpiry < Date.now()) {
          return res.status(401).json({error: 'OTP has expired!'});
      }

      // Cập nhật trạng thái user đã verify
      await updateRecord('users', {
          otp: null, 
          otpExpiry: null,
          isVerified: true
      }, 'email', email);

      res.status(200).json({
          message: 'Email verified successfully! You can now login.',
          verified: true
      });
  } catch (error) {
      console.error('Verify OTP Error:', error);
      res.status(500).json({error: error.message});
  }
};

// Sửa lại hàm login để kiểm tra verify
const login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
      return res.status(400).json({ error: "Email and password fields cannot be empty!" });
  }

  try {
      const user = await checkRecordExist("users", "email", email);
      
      if (!user || !user.password) {
          return res.status(401).json({ error: "Invalid credentials" });
      }

      // Kiểm tra xem user đã verify chưa
      if (!user.isVerified) {
          return res.status(403).json({ 
              error: "Please verify your email before logging in",
              requiresVerification: true,
              email: email
          });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (passwordMatch) {
          res.status(200).json({
              userId: user.userId,
              email: user.email,
              name: user.name,
              avatar: user.avatar,
              access_token: generateAccessToken(user.userId),
          });
      } else {
          res.status(401).json({ error: "Invalid credentials" });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
    const {email} = req.body;
    
    if(!email) {
        return res.status(400).json({error: "Email field cannot be empty!"});
    }

    try {
        const user = await checkRecordExist("users", "email", email);
        
        if(!user) {
            return res.status(404).json({error: "User not found!"});
        }

        const resetToken = uuidv4();
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        await updateRecord("users", {resetToken, resetTokenExpiry}, "email", email);

        const transporter = createEmailTransporter();
        const mailOptions = {
            from: '"ADMIN" <ilovevietnam272@gmail.com>',
            to: `${email}`,
            subject: "Password Reset",
            html: `
                <h2>Password Reset</h2>
                <p>Click on the button below to reset your password:</p>
                <a href="http://localhost:3000/reset-password?token=${resetToken}" 
                   style="display: inline-block; padding: 10px 20px; font-size: 16px; 
                          color: #fff; background-color: #007bff; 
                          text-decoration: none; border-radius: 5px;">
                    Reset Password
                </a>
                <p>It is your code to change a password:</p>
                <p style="font-weight: bold; font-size: 18px;">${resetToken}</p>
                <p>If you did not request a password reset, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({message: "Password reset email sent!"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const changePassword = async (req, res) => {
    const {email, password, newPassword, resetToken} = req.body;
    
    if(!email || !newPassword || (!password && !resetToken)) {
        return res.status(400).json({
            error: "Email, new password, and either current password or reset token are required!"
        });
    }

    try {
        const user = await checkRecordExist("users", "email", email);
        
        if(!user) {
            return res.status(404).json({error: "User not found!"});
        }

        if (resetToken) {
            if(user.resetToken !== resetToken || user.resetTokenExpiry < Date.now()) {
                return res.status(401).json({error: "Invalid or expired reset token!"});
            }
        } else {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({error: "Invalid credentials!"});
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await updateRecord(
            "users", 
            {
                password: hashedPassword, 
                resetToken: null, 
                resetTokenExpiry: null
            }, 
            "email", 
            email
        );

        res.status(200).json({message: "Password updated successfully!"});
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

const updateUserName = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.userId;

    try {
        await updateRecord("users", { name }, "userId", userId);
        res.status(200).json({ message: "Username updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const changeAvatar = async (req, res) => {
    const { avatar } = req.body;
    const userId = req.user.userId;

    try {
        await updateRecord("users", { avatar }, "userId", userId);
        res.status(200).json({ message: "Avatar updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProfile = async (req, res) => {
  try {
      const userId = req.user.userId;
      const user = await checkRecordExist('users', 'userId', userId);
      
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Trả về thông tin user (không bao gồm password)
      const userProfile = {
          userId: user.userId,
          email: user.email,
          name: user.name,
          avatar: user.avatar
      };

      res.status(200).json(userProfile);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

module.exports = {
    register,
    login,
    forgotPassword,
    changePassword,
    verifyOTP,
    updateUserName,
    changeAvatar,
    getProfile
};