const express = require('express');
const router = express.Router(); //express子路由，方法写这
const Plan = require('../../model/Plan')
const Order = require("../../model/Order")
const dayjs = require("dayjs");
module.exports = app =>{
    //增
    router.post('/plan', async (req, res)=> {
        const model = await Plan.create(req.body)
        res.send(model)
    });
    //删
    router.delete('/plan', async (req, res)=> {
        await Plan.findByIdAndDelete(req.body._id)
        res.send({
            success:true,
        })
    });
    //改
    router.put('/plan', async (req, res)=> {
        const model = await Plan.findByIdAndUpdate(req.body._id,req.body)
        res.send(model)
    });
    router.get('/plans', async (req, res)=> {
        const model = await Plan.find()
        res.send(model)
    });
    //查
    router.get("/plan/:id", async (req, res) => {
        const planId = req.params.id;
        if (!planId) {
            return res.send({
                message: "planId为必填项",
            });
        }
        // 先获取该影院的订单信息orders
        let { orders } = await Plan.findById(planId).populate("orders").lean();
        // 数据处理
        // 先将该影院的所有未支付状态的订单给清除掉,防止订单越积越多
        // 将支付成功的订单的座位信息保存下来，最后赋值给排片数据
        let seatInfo = [];
        orders.map(async (item) => {
            if (item.payStatus === 0) {
                return  Order.findByIdAndDelete(item._id);
            }
            seatInfo = [...seatInfo, ...item.seatInfo];
        });

        let data = await Plan.findById(planId)
            .populate("movieId")
            .populate("hallId")
            .lean();
        // 数据处理
        // 获取该影院该排片的座位信息
        data.seatInfo = seatInfo;
        // 获取影院该排片的日期是明天的还是后天的
        const today = dayjs(new Date()).format("YYYY-MM-DD");
        const todayTime = new Date(today).getTime();
        const tomorrowTime = todayTime + 24 * 60 * 60 * 1000;
        const afterTomorrowTime = todayTime + 2 * 24 * 60 * 60 * 1000;
        const tomorrow = dayjs(new Date(tomorrowTime)).format("YYYY-MM-DD");
        const afterTomorrow = dayjs(new Date(afterTomorrowTime)).format(
            "YYYY-MM-DD"
        );
        let showDay = "";
        if (data.outDate === tomorrow) {
            showDay = "明天";
        }
        if (data.outDate === afterTomorrow) {
            showDay = "后天";
        }
        data.showDay = showDay;
        // 将outDate的时间分隔出年月日，方便展示
        data.outDateYYYY = data.outDate.slice(0, 4);
        data.outDateMM = data.outDate.slice(5, 7);
        data.outDateDD = data.outDate.slice(8, 10);
        res.send({
            planData: data,
            status: "200",
        });
    });
    app.use('/admin/api',router)//挂载到路由上
}