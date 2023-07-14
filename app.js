require('dotenv').config();

// const mongoose = require('mongoose');
// mongoose.set("strictQuery",false);
// const mongoDB = "mongodb+srv://Anubhav:Anubhav152000@cluster0.d8ngx1v.mongodb.net/local_library?retryWrites=true&w=majority";

// main().catch((err)=>console.log(err));
// async function main() {
//     await mongoose.connect(mongoDB);
// }

var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/OnChat');

const app = require('express')();

const http = require('http').Server(app);

const userRoute = require('./routes/userRoute');
require('./models/userModel');

app.use('/',userRoute);

const io = require('socket.io')(http);

var usp = io.of('/user-namespace');

usp.on('connection',async function(socket){
    console.log('User Connected');

    var userId = socket.handshake.auth.token;

    await User.findByIdAndUpdate({ _id: userId }, { $set:{ is_online:'1' }});

    socket.on('disconnect',async function(){
        console.log('User Disconnected');
        
        var userId = socket.handshake.auth.token;

        await User.findByIdAndUpdate({ _id: userId }, { $set:{ is_online:'0' }});

    });
});

http.listen(3000, function(){
    console.log('Server is running');
});