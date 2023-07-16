const express = require('express');
const router = express.Router(); //express子路由，方法写这
const Order = require('../../model/Order')
const User = require("../../model/User");

module.exports = app =>{
    // 1.添加订单（座位选择页）{传入请求体参数：影院名，排片id，用户id，座位信息（座位二维坐标），购票数量，购票总价格，场次日期}
    router.post("/addOrder", async (req, res) => {
        let {
            hallName,
            seatInfo,
            planId,
            userId,
            movieId,
            hallId,
            ticketNum,
            ticketPrice,
            totalPrice,
            orderDate,
            orderTime,
        } = req.body;
        if (!hallName) {
            return res.send({
                message: "请求体中hallName为必填项",
            });
        }
        if (!planId) {
            return res.send({
                message: "请求体中planId为必填项",
            });
        }
        if (!userId) {
            return res.send({
                message: "userId为必填项",
            });
        }
        if (!seatInfo || seatInfo.length === 0) {
            return res.send({
                message: "seatInfo为必填项",
            });
        }
        if (!ticketNum) {
            return res.send({
                message: "ticketNum为必填项",
            });
        }
        if (!ticketPrice) {
            return res.send({
                message: "ticketPrice为必填项",
            });
        }
        if (!totalPrice) {
            return res.send({
                message: "totalPrice为必填项",
            });
        }
        if (!orderDate) {
            return res.send({
                message: "orderDate为必填项",
            });
        }
        if (!orderTime) {
            return res.send({
                message: "orderTime为必填项",
            });
        }
        if (!movieId) {
            return res.send({
                message: "movieId为必填项",
            });
        }
        if (!hallId) {
            return res.send({
                message: "hallId为必填项",
            });
        }
        // console.log(totalPrice);
        // 新增一个未支付状态的订单
        const data = await Order.create(req.body);
        res.send({
            message: "添加订单成功~",
            data: data,
            status: "200",
        });
    });
    // 2.根据订单id获取订单信息（订单提交页面）{传入参数：订单id}
    router.get("/getOrderDataFromSubmit/:id", async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return res.send({
                message: "参数id为必填项",
            });
        }
        const orderData = await Order.findById(id)
            .populate("userId")
            .populate("hallId")
            .populate("movieId")
            .lean();
        // console.log(orderData);
        res.send({
            orderData,
            status: "200",
        });
    });
    // 3.根据订单id获取订单信息（订单支付页面）{传入参数：订单id}
    router.get("/getOrderDataFromPay/:id", async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return res.send({
                message: "参数id为必填项",
            });
        }
        const orderData = await Order.findById(id).lean();
        // 数据处理
        // 随机生成一个唯一的订单编号
        const randomNum = "1234567890";
        const generateStringNum = (length) => {
            let stringNum = "";
            for (let i = 0; i < length; i++) {
                stringNum += randomNum[Math.floor(Math.random() * randomNum.length)];
            }
            return stringNum;
        };
        let orderNum = generateStringNum(14);
        // 这里检验随机数是否唯一
        const orderList = await Order.find().lean();
        // 在订单列表里面看是否有重复
        let checkIsOnly = (orderNum) => {
            const status = orderList.some((item) => {
                return item.orderNum === orderNum;
            });
            if (status) {
                orderNum = "";
                orderNum = generateStringNum(14);
                checkIsOnly(orderNum);
            }
        };
        checkIsOnly(orderNum);
        orderData.orderNum = orderNum;
        console.log(orderData.orderNum)
        res.send({
            orderData,
            status: "200",
        });
    });
    // 4.支付订单，根据订单id更新数据（订单支付页面）{传入参数：订单id,支付类型，订单编号}
    router.put("/payOrder/:id", async (req, res) => {
        const { id } = req.params;
        const { payType, orderNum } = req.body;
        if (!id) {
            return res.send({
                message: "参数id为必填项",
            });
        }
        if (!payType || !orderNum) {
            return res.send({
                message: "请求体中payType、orderNum为必填项",
            });
        }
        // 数据处理
        // 随机生成一个唯一的取票码
        const randomNum = "1234567890";
        // 生成length位数的随机验证码
        const generateStringNum = (length) => {
            let stringNum = "";
            for (let i = 0; i < length; i++) {
                stringNum += randomNum[Math.floor(Math.random() * randomNum.length)];
            }
            return stringNum;
        };
        let ticketCode = generateStringNum(6);
        // 这里检验随机数是否唯一
        const orderList = await Order.find().lean();
        // 在订单列表里面看是否有重复
        let checkIsOnly = (ticketCode) => {
            const status = orderList.some((item) => {
                return item.ticketCode == ticketCode;
            });
            if (status) {
                ticketCode = "";
                ticketCode = generateStringNum(6);
                checkIsOnly(ticketCode);
            }
        };
        checkIsOnly(ticketCode);

        // 改变支付状态为1（已支付）
        const payStatus = 1;

        const data = await Order.findByIdAndUpdate(id, {
            payType,
            orderNum,
            payStatus,
            ticketCode,
            payStatus,
        });
        res.send({
            message: "支付成功",
            ticketCode,
            status: "200",
        });
    });
    // 5.根据用户id获取订单数据，（我的订单页面）{传入参数：用户id}
    router.get("/getUserOrderData/:id", async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return res.send({
                message: "参数id为必填项",
            });
        }
        const orderList = await Order.find()
            .where({
                userId: id,
            })
            .populate("movieId")
            .populate("hallId")
            .lean();
        res.send({
            orderList,
            status: "200",
        });
    });
    // 6.根据订单id删除订单，（我的订单页面）{传入参数：订单id}
    router.delete("/deleteOrder/:id", async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return res.send({
                message: "参数id为必填项",
            });
        }
        const data = await Order.findByIdAndDelete(id);
        res.send({
            message: "删除订单成功",
            status: "Ok",
        });
    });

    //后台
    router.get('/order', async (req, res) => {
        const orderList = await Order.find()
            .populate("userId")
            .populate("movieId")
            .lean();
        res.send({
            orderList,
            status: "200",
        });
    });
    //后台删除
    router.delete('/order', async (req, res) => {
        await Order.findByIdAndDelete(req.body._id)
        res.send({
            success: true,
        })
    });

    app.use('/admin/api',router)//挂载到路由上
}