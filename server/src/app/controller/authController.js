const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { checkRecordExist, insertRecord, updateRecord } = require('../../utils/sqlFunction');

function getGooglePhotoUrl(profile) {
    // Lấy URL gốc của ảnh Google mà không có tham số
    if (profile.photos && profile.photos.length > 0) {
        const originalUrl = profile.photos[0].value;
        // Loại bỏ tham số ?sz= nếu có
        return originalUrl.split('?')[0];
    }
    return null;
}

const authController = {
    googleStrategy: async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const avatarUrl = getGooglePhotoUrl(profile);
            const existingUser = await checkRecordExist('users', 'email', email);

            if (existingUser) {
                // Cập nhật avatar nếu user đã tồn tại
                await updateRecord('users', {
                    avatar: avatarUrl,
                    name: profile.displayName
                }, 'userId', existingUser.userId);
                
                return done(null, {
                    ...existingUser,
                    avatar: avatarUrl,
                    name: profile.displayName
                });
            }

            // Tạo user mới
            const newUser = {
                userId: uuidv4(),
                email: email,
                name: profile.displayName,
                password: '',
                avatar: avatarUrl
            };

            await insertRecord('users', newUser);
            return done(null, newUser);

        } catch (error) {
            console.error('Google Strategy Error:', error);
            return done(error, null);
        }
    },

    googleCallback: (req, res) => {
        try {
            const token = jwt.sign(
                { userId: req.user.userId },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Đảm bảo thông tin user được truyền đúng
            const userInfo = encodeURIComponent(JSON.stringify({
                userId: req.user.userId,
                name: req.user.name,
                email: req.user.email,
                avatar: req.user.avatar
            }));

            res.redirect(`http://localhost:3000/oauth/success?token=${token}&user=${userInfo}`);
        } catch (error) {
            console.error('Google Callback Error:', error);
            res.redirect('http://localhost:3000/login');
        }
    }
};

module.exports = authController;