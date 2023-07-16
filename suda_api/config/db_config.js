
module.exports = app =>{
    const mongoose=require("mongoose")
    //连接数据库
    mongoose.connect("mongodb://127.0.0.1:27017/suda_movie",{
        useNewUrlParser :true
    })
        .then(() => console.log('数据库连接成功'))
        .catch(err => console.log('数据库连接失败', err));

    require('require-all')(__dirname + '/../model')
}

