const express = require('express');
const router = express.Router(); //express子路由，方法写这
const Advertise = require('../../model/Advertise')
const multer = require("multer");
const upload = multer({dest: __dirname + '/../../uploads/adIcon'}).single('file')

module.exports = app =>{
    //增加广告
    router.post('/advertise', async (req, res)=> {
        const model = await Advertise.create(req.body)
        res.send(model)
    });
    //根据广告_id删除
    router.delete('/advertise', async (req, res)=> {
        await Advertise.findByIdAndDelete(req.body._id)
        res.send({
            success:true,
        })
    });
    //根据广告_id修改
    router.put('/advertise', async (req, res)=> {
        const model = await Advertise.findByIdAndUpdate(req.body._id,req.body)
        res.send(model)
    });
    //查
    router.get('/advertise', async (req, res)=> {
        const adData = await Advertise.find()
        res.send(adData)
    });
    //上传海报
    router.post('/upload', upload, async (req, res) => {
        const file = req.file
        file.url = `http://localhost:3000/uploads/adIcon/${file.filename}`
        res.send(file)
    });
    app.use('/admin/api',router)//挂载到路由上
}