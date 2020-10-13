const { json } = require("body-parser");
//用于当前的login和register
const express = require("express");
const router = express.Router();
const passport = require('passport');

const Profile = require("../../modules/Profile");
//$route get api/profiles/test
//@desc  返回的请求的json数据
//@access public


//测试使用
router.get("/test",(req,res)=>{
    res.json({msg:"profile work"})
})

//$route Post api/profiles/add
//@desc  创建信息接口 添加
//@access private

router.post("/add",passport.authenticate("jwt",{session:false}),(req,res) =>{
    const profileFields = {};
    if(req.body.type) profileFields.type = req.body.type;
    if(req.body.describle) profileFields.describle = req.body.describle;
    if(req.body.income) profileFields.income = req.body.income;
    if(req.body.expend) profileFields.expend = req.body.expend;
    if(req.body.cash) profileFields.cash = req.body.cash;
    if(req.body.remark) profileFields.remark = req.body.remark;
    
    //把这些信息存储进去
    new Profile(profileFields).save().then(profile =>{
        res.json(profile)//存储成功则返回json
    })
})



//$route Post api/profiles
//@desc  获取所有信息
//@access private

router.get("/",passport.authenticate("jwt",{session:false}),(req,res) =>{
    Profile.find()
        .then(profile =>{//成功
            if(!profile){
                return res.status(404).json('没有任何内容')
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err))
    });


    //$route Post api/profiles：ID
//@desc  获取单个信息
//@access private

router.get("/:id",passport.authenticate("jwt",{session:false}),
(req,res) =>{
    Profile.findOne({_id:req.params.id})
        .then(profile =>{//成功
            if(!profile){
                return res.status(404).json('没有任何内容')
            }
            res.json(profile)
        })
        .catch(err => res.status(404).json(err))
  
})

//$route Post api/profiles/edit
//@desc  编辑信息接口
//@access private

router.post("/edit/:id",
            passport.authenticate("jwt",{session:false}),
            (req,res) =>{
    const profileFields = {};
    if(req.body.type) profileFields.type = req.body.type;
    if(req.body.describle) profileFields.describle = req.body.describle;
    if(req.body.income) profileFields.income = req.body.income;
    if(req.body.expend) profileFields.expend = req.body.expend;
    if(req.body.cash) profileFields.cash = req.body.cash;
    if(req.body.remark) profileFields.remark = req.body.remark;
    
    Profile.findOneAndUpdate(
        {_id:req.body.id},//拿到id
        {$set:profileFields},//更新内容
        {new:true}//新的东西
    ).then(profile => res.json(profile))
})

//$route Post api/profiles/delete:ID
//@desc  删除信息接口
//@access private
router.delete('/delete/:id',
    passport.authenticate("jwt",{session:false}),
    (req,res) =>{
            Profile.findOneAndRemove({_id:req.params.id}).then(profile =>{
                profile.save().then(profile => res.json(profile))
            })
            .catch(err =>res.status(404).json("删除失败"))
        });


module.exports = router;
