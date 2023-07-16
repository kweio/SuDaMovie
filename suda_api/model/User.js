const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

const schema = new mongoose.Schema({
    name:{type:String},  //昵称
    phone:{type:Number}, //手机号
    password:{          //密码
        type:String,
        set(val){
            //加密
          return bcrypt.hashSync(val,10)
        },
    },
    age:{type:Number},  //年龄
    sex:{type:String},  //性别
    icon:{type:String}, //头像
    sup:{type:Boolean},  //权限， true管理员 false普通用户
})
module.exports = mongoose.model('User',schema)