const express = require('express');
const router = express.Router(); //express子路由，方法写这
const Hall = require('../../model/Hall')
module.exports = app =>{
    //增
    router.post('/hall', async (req, res)=> {
        const model = await Hall.create(req.body)
        res.send(model)
    });
    //删
    router.delete('/hall', async (req, res)=> {
        await Hall.findByIdAndDelete(req.body._id)
        res.send({
            success:true,
        })
    });
    //改
    router.put('/hall', async (req, res)=> {
        const model = await Hall.findByIdAndUpdate(req.body._id,{$set:{name:req.body.name}})
        res.send(model)
    });
    //查
    router.get('/hall', async (req, res)=> {
        res.setHeader("Access-Control-Allow-Origin", "*")
        const items = await Hall.find()
        res.send(items)
    });

    app.use('/admin/api',router)//挂载到路由上
}