// 后端接口

const express = require('express');
const mongoose = require('mongoose');
// mongoose.set('useFindAndModify', false);
const bodyParser = require("body-parser");
const passport = require('passport')
const app = express();
//引入users.js
const users = require('./routes/api/users')
//引入profiles.js
const profiles = require('./routes/api/profiles')


//DB config
const db = require('./config/keys').mongoURI;

//使用body-parser的中间件
app.use(bodyParser.urlencoded({extended:false}));
// app.use("bodyParser.urlencoded(extended:false)")
app.use(bodyParser.json());

//Connect to mongodb
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true })
                .then(() =>console.log("MongoDB Connected"))
                .catch(err => console.log(err));

                
//passport 初始化
app.use(passport.initialize());
require("./config/passport")(passport);
//把文件传递给上面定义的passport

//设置一个路由
app.get("/",(req,res) =>{
    res.send('hello world!')
})
//中间件使用routes
app.use('/api/users',users)
app.use('/api/profiles',profiles)



const port = process.env.PORT || 5000;//设置端口

app.listen(port,() =>{
    console.log(`Server running on port ${port}`);
})
