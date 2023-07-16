const express = require('express');
const router = express.Router(); //express子路由，方法写这
const Category = require('../../model/Category')
module.exports = app =>{
    //增
    router.post('/category', async (req, res)=> {
        const model = await Category.create(req.body)
        res.send(model)
    });
    //删
    router.delete('/category', async (req, res)=> {
        await Category.findByIdAndDelete(req.body._id)
        res.send({
            success:true,
        })
    });
    //改
    router.put('/category', async (req, res)=> {
        const model = await Category.findByIdAndUpdate(req.body._id,{$set:{name:req.body.name}})
        res.send(model)
    });
    //查
    router.get('/category', async (req, res)=> {
        res.setHeader("Access-Control-Allow-Origin", "*")
        const items = await Category.find()
        res.send(items)
    });

    app.use('/admin/api',router)//挂载到路由上
}