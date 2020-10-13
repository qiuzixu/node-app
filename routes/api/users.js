//用于当前的login和register
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");//加密工具
const jwt = require('jsonwebtoken')//token保存数据库数据
const gravatar = require("gravatar")
const keys = require("../../config/keys")
const passport = require('passport');

const User = require("../../modules/User");
//$route get api/users/test
//@desc  返回的请求的json数据
//@access public
router.get("/test",(req,res)=>{
    res.json({msg:"login work"})
})

//$route post api/users/register  //注册用post
//@desc  返回的请求的json数据
//@access public

//注册
router.post("/register",(req,res)=>{
    console.log(req.body)

    //查询数据库中是否有邮箱
    User.findOne({email:req.body.email})
        .then((user) =>{
            if(user){
                // return res.status(400).json({email:"邮箱已经被注册"})//因为前端有对应验证
                return res.status(400).json("邮箱已经被注册")//因为前端有对应验证
                
            }else{
                const avatar = gravatar.url('req.body.email', {s: '200', r: 'pg', d: 'mm'});
                const newUser = new User({
                    name:req.body.name,
                    email:req.body.email,
                    avatar,
                    password:req.body.password,
                    // password2:req.body.password2,
                    identify:req.body.identify
                })
                // 加密
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {
                        // Store hash in your password DB.
                        if(err) throw err;

                        newUser.password = hash;//加密的面
                        
                        newUser.save()
                                    .then(user =>res.json(user))
                                    .catch(err => console.log(err))
                    });
                });
            }
        })
})//要安装post的第三方模块body-parser

//$route post api/users/login //ost
//@desc  返回token
//@access public

//登录
router.post("/login",(req,res) =>{
    const email = req.body.email;
    const password = req.body.password;
    //查询数据库
    User.findOne({email})
                .then(user =>{
                    if(!user){
                        return res.status(404).json("用户不存在！")
                    }  

                    //密码匹配
                    bcrypt.compare(password,user.password)
                            .then(isMatch =>{
                                if(isMatch){
                                    // res.json({msg:"success"})
                                    const rule = {
                                                 id:user.id,
                                                 name:user.name,
                                                 avatar:user.avatar,
                                                 identify:user.identify
                                                };
                                    // jwt.sign("规则","加密名字","过期时间","箭头函数")
                                    jwt.sign(rule,keys.secretOrKey,{expiresIn:3600},(err,token) => {
                                        if(err) throw err;
                                        res.json({
                                            success:true,
                                            token:"Bearer " + token  //Bearer是固定的
                                        })
                                    })

                                }else{
                                    return res.status(400).json("密码错误！")
                                }
                            })
                })
})


//$route GEt api/users/current 
//@desc  return current user
//@access private
router.get("/current",passport.authenticate("jwt",{session:false}),(req,res) =>{
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.name,
        identify:req.user.identify
    })
})


module.exports = router;
