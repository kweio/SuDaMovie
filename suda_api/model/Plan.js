// 导入mongoose
const mongoose = require('mongoose')
// 实例化模型
const schema = new mongoose.Schema({
    name: {type: String},       //电影名
    movieId: {type: mongoose.Schema.Types.ObjectId, ref: 'Movie'},// 电影id
    hall: {type: String},        //影厅
    hallId:{type: mongoose.Schema.Types.ObjectId, ref: 'Hall'},
    outDate: {type: String},     //放映日期
    inTime: {type: String},     //放映时间
    leaveTime: {type: String},     //散场时间
    price: {type: String},        //售价
})

module.exports = mongoose.model('Plan', schema)