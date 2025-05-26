const friendRouter = require('./friendRoute');
const userRouter = require('./userRouter');
const postRouter = require('./postRouter');

function route(app){
    app.use('/friend', friendRouter)
    app.use('/post', postRouter);
    app.use('/user', userRouter);
}

module.exports = route;