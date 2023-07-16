const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name:{type:String}, //电影名
    icon:{type:String}, //海报
    category:[{type:Array}], //类别
    language: { type: String },     //语言
    actor:{type:String}, //演员
    director:{type:String}, //导演
    inDate:{type:String},//上映时间
    introduce:{type:String}, //简介
})
schema.virtual('plans', {
    localField: '_id',  //内键，schema对应的模型movie的_id
    ref: 'Plan',  //关联的模型
    foreignField: 'movieId',  //外键，关联模型plan的movieId字段
    justOne: false      //只查询一条字段
})
module.exports = mongoose.model('Movie',schema)
