.env file
PORT=
HOST=localhost
USER=root
PASSWORD=
DATABASE=
JWT_SECRET=
EMAIL= Your_email
EMAIL_PASSWORD= enable 2FA, create app password
SESSION_KEY=


# BlogWeb - Social Blogging Platform

A full-stack social blogging platform built with React, Node.js, Express, and MySQL. Users can create, share, and interact with blog posts, manage friendships, and receive real-time notifications.

## 🌟 Features

### Core Features
- **User Authentication**: Registration, login, email verification, password reset
- **Social Login**: Google OAuth integration
- **Blog Management**: Create, edit, delete blog posts with image support
- **Social Features**: Friend requests, friend management, user suggestions
- **Real-time Notifications**: Friend requests and interactions
- **Content Discovery**: Post ranking (daily/monthly), topic-based categorization
- **User Profiles**: Avatar management, profile customization
- **Responsive Design**: Mobile-friendly interface

### Technical Features
- JWT-based authentication
- File upload and image processing
- Email notifications
- Real-time updates
- Local storage for offline functionality

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL database
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Nusuit/Blog.git
cd BlogWeb
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Setup**

Create a `.env` file in the server directory:
```env
PORT=5000
HOST=localhost
USER=root
PASSWORD=your_mysql_password
DATABASE=blogweb_db
JWT_SECRET=your_jwt_secret_key
EMAIL=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_password
SESSION_KEY=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. **Database Setup**
- Create a MySQL database named `blogweb_db`
- The application will automatically create required tables on startup

5. **Start the application**
```bash
# From the root directory
npm start
```

This will start both the frontend (http://localhost:3000) and backend (http://localhost:5000) concurrently.

## 📁 Project Structure

```
BlogWeb/
├── frontend/                 # React frontend application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── common/      # Reusable components
│   │   │   └── posts/       # Post-related components
│   │   ├── contexts/        # React contexts
│   │   ├── layout/          # Layout components
│   │   ├── styles/          # CSS stylesheets
│   │   └── assets/          # Images and static assets
│   └── package.json
├── server/                  # Node.js backend
│   ├── src/
│   │   ├── app/
│   │   │   ├── controller/  # Route controllers
│   │   │   └── middleware/  # Custom middleware
│   │   ├── config/          # Configuration files
│   │   ├── router/          # API routes
│   │   ├── schemas/         # Database schemas
│   │   └── utils/           # Utility functions
│   └── package.json
├── chatbot-service/         # Python chatbot service
└── package.json            # Root package.json
```

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Client-side routing
- **Context API** - State management
- **CSS3** - Styling
- **Lucide React** - Icons
- **FontAwesome** - Additional icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **JWT** - Authentication
- **Passport.js** - OAuth authentication
- **Nodemailer** - Email service
- **Multer** - File uploads
- **bcrypt** - Password hashing

### Additional Services
- **Python Flask** - Chatbot service
- **Concurrently** - Run multiple processes

## 🔧 API Endpoints

### Authentication
- `POST /user/register` - User registration
- `POST /user/login` - User login
- `POST /user/verify-otp` - Email verification
- `POST /user/forgot-password` - Password reset
- `GET /auth/google` - Google OAuth

### User Management
- `GET /user/profile` - Get user profile
- `PUT /user/update-name` - Update user name
- `PUT /user/change-avatar` - Change user avatar

### Friend Management
- `POST /friend/add` - Send friend request
- `POST /friend/accept` - Accept friend request
- `POST /friend/remove` - Remove friend
- `GET /friend/suggestions` - Get friend suggestions
- `GET /friend/notifications` - Get notifications

### Blog Posts
- `GET /blog/posts` - Get all posts
- `POST /blog/create` - Create new post
- `PUT /blog/edit/:id` - Edit post
- `DELETE /blog/delete/:id` - Delete post

## 📱 Key Components

### Frontend Components
- **Header** - Navigation and notifications
- **Sidebar** - Navigation menu and user stats
- **PostSection** - Main blog post display
- **CreatePost** - Post creation modal
- **FriendSuggestion** - Friend recommendation system
- **NotificationsPanel** - Real-time notifications

### Backend Controllers
- **authController** - OAuth authentication
- **userController** - User management
- **friendController** - Friend system
- **blogController** - Blog post management

## 🎨 Styling

The application uses modular CSS with component-specific stylesheets:
- Responsive design principles
- Modern color scheme
- Consistent spacing and typography
- Hover effects and animations

## 🚦 Development

### Available Scripts

**Root level:**
```bash
npm start          # Start both frontend and backend
npm run server     # Start backend only
npm run frontend   # Start frontend only
```

**Frontend:**
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

**Backend:**
```bash
npm start          # Start with nodemon
```

### Code Structure Guidelines
- Use functional components with hooks
- Implement proper error handling
- Follow consistent naming conventions
- Add comments for complex logic
- Use TypeScript for type safety (future enhancement)

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- SQL injection prevention
- XSS protection

## 🐛 Troubleshooting

### Common Issues

1. **Module not found errors**
   ```bash
   cd server && npm install
   cd frontend && npm install
   ```

2. **Database connection issues**
   - Check MySQL service is running
   - Verify .env database credentials
   - Ensure database exists

3. **Port conflicts**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - Make sure ports are available

4. **Email functionality**
   - Enable 2FA on Gmail
   - Use App Password instead of regular password

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Nguyễn An Đức** - Leader
- **Ngô Hoàng Phương Khánh** - Member
- **Phan Huy Kiên** - Member
- **Phạm Quốc Anh** - Member
- **Huỳnh Trần Quốc Huy** - Member

## 📞 Support

For support, email [your-email@example.com] or create an issue in the repository.

---

Built with ❤️ by CNPM Team
