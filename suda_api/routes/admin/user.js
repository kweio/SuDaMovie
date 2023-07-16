const express = require('express');
const bcrypt = require('bcrypt')
const JWT = require('../../util/jwt')
//本地图片路径
const multer = require('multer') //上传所需组件
const upload = multer({dest: __dirname + '/../../uploads/userIcon'}).single('file')
const router = express.Router(); //express子路由，方法写这
const User = require('../../model/User')

module.exports = app => {
    //后台
    //注册用户
    router.post('/register', async (req, res) => {
        const {name,phone} = req.body
        const currentlyName = await User.findOne({name})
        const currentlyPhone = await User.findOne({phone})
        if (currentlyName) {
            return res.send({
                message: '用户已存在',
                status: 422,
            })
        }else if (currentlyPhone) {
            return res.send({
                message: '手机号已注册',
                status: 422,
            })
        }else{
            const model = await User.create(req.body)
            res.send({
                model:model,
                status:300,
            })
        }

    })
    //上传头像
    router.post('/user/upload', upload, async (req, res) => {
        const file = req.file
        file.url = `http://localhost:3000/uploads/userIcon/${file.filename}`
        res.send(file)
    })
    //登录
    router.post('/login', async (req, res) => {
        const {name, password} = req.body //解构赋值
        // 根据用户名找密码
        const currentlyUser = await User.findOne({name}).select('+password')
        if (!currentlyUser) {
            return res.send({
                message: '用户不存在',
                status: 422,
            })
        }
        // 校验密码
        //bcrypt模块加密,compareSync比较是否匹配
        // const isValid = bcrypt.compareSync(password, currentlyUser.password)
        // if (!isValid) return res.send({
        //     message: '密码错误',
        //     status: 422,
        // })
        // else if (currentlyUser.sup !== true){
        //     return res.send({
        //         message:'用户权限不够',
        //         status:422,
        //     })
        // }
        // 返回token
        const token = JWT.generate({
            id: currentlyUser._id,
        })

        res.send({
            sup: currentlyUser.sup,
            userID: currentlyUser._id,
            token: "KZZ" + token,
            status: 300,
        })
    })
    //登录
    router.post('/userLogin', async (req, res) => {
        const {name, password} = req.body //解构赋值
        // 根据用户名找密码
        const currentlyUser = await User.findOne({name}).select('+password')
        if (!currentlyUser) {
            return res.send({
                message: '用户不存在',
                status: 422,
            })
        }
        // 校验密码
        //bcrypt模块加密,compareSync比较是否匹配
        const isValid = bcrypt.compareSync(password, currentlyUser.password)
        if (!isValid) return res.send({
            message: '密码错误',
            status: 422,
        })
        // 返回token
        const token = JWT.generate({
            id: currentlyUser._id,
        })

        res.send({
            userID: currentlyUser._id,
            token: "KZZ" + token,
            status: 300,
        })
    })
    //显示用户信息
    router.get('/user', async (req, res) => {
        const userData = await User.find()
        res.send(userData)
    });
    //删
    router.delete('/user', async (req, res) => {
        await User.findByIdAndDelete(req.body._id)
        res.send({
            success: true,
        })
    });
    //改
    router.put('/user', async (req, res) => {
        const model = await User.findByIdAndUpdate(req.body._id, req.body)
        res.send(model)
    });

    //用户端
    //获取用户信息
    router.get("/oneUser/:_id", async (req, res) => {
        const userId = req.params._id
        const userData = await User.findById(userId).lean()
        // delete userData.password; //密码不发送给前台
        res.send({
            userInfo: {
                ...userData,
            },
            status: "300",
        });
    });
    //用户更新资料
    router.put("/oneUser/:_id", async (req, res) => {
        const userId = req.params._id;
        await User.findByIdAndUpdate(userId, req.body);
        res.send({
            userInfo: {
                ...req.body
            },
            message: "更新成功！",
            status: "300",
        });
    });
    //用户修改密码
    router.post("/oneUser/:id", async (req, res) => {
        const userId = req.params.id
        const {oldPwd, newPwd, confirmPwd} = req.body.changePwd;
        if (!oldPwd || !newPwd || !confirmPwd) {
            return res.send({
                message: "oldPwd、newPwd、confirmPwd为必填参数，不可为空~",
            });
        }
        if (newPwd !== confirmPwd) {
            return res.send({
                message: "请保持newPwd、confirmPwd值一致~",
            });
        }
        const userInfo = await User.findById(userId);
        const isValid = bcrypt.compareSync(oldPwd, userInfo.password)
        // if (!Object.keys(userInfo).length) {
        //     return res.send({
        //         message: "id不存在，请传入有效id",
        //     });
        // }
        if (!isValid) {
            return res.send({
                message: "旧密码错误，请重新输入~",
            });
        }
        const userData = await User.findByIdAndUpdate(userId, {
            password: confirmPwd,
        });
        res.send({
            message: "修改密码成功",
            status: "300",
        });
    });
    app.use('/admin/api', router)//挂载到路由上
}
