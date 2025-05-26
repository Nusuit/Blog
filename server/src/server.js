const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const PORT = process.env.PORT;
const route = require('./router/index');
const connectDB = require('./config/db');
const cors = require('cors');
const passport = require('./config/passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

//connect to db
connectDB();
console.log('PASSWORD:', process.env.PASSWORD);
console.log('DATABASE:', process.env.DATABASE);

// Cấu hình CORS trước các middleware khác
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
}));

//working with passport and session
app.use(passport.initialize());
app.use(passport.session());

//rest api with json
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: true,
}));

app.use('/auth', require('./router/authRouter'));
route(app);

//listen localhost
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});