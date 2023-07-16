const express = require('express');
const multer = require('multer') //上传所需组件
//本地图片路径
const upload = multer({dest: __dirname + '/../../uploads/movieIcon'}).single('file')
const router = express.Router(); //express子路由，方法写这
const Movie = require('../../model/Movie')
const Plan = require('../../model/Plan')

module.exports = app => {
  // 1.新增电影
  router.post('/movie', async (req, res) => {
    const model = await Movie.create(req.body)
    res.send(model)
  })
  // 2.获取所有电影信息
  router.get('/movie', async (req, res)=> {
    const movieData = await Movie.find()
    res.send(movieData)
  });
  // 3.删
  router.delete('/movie', async (req, res)=> {
    await Movie.findByIdAndDelete(req.body._id)
    res.send({
      success:true,
    })
  });
  // 4.修改
  router.put('/movie', async (req, res)=> {
    const model = await Movie.findByIdAndUpdate(req.body._id,req.body)
    res.send(model)
  });
  // 5.根据电影id获取电影详情页信息(电影详情页)
  router.get("/movieDetail/:id", async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res.send({
        message: "id(电影id)为必传参数~",
      });
    }
    const model = await Movie.findById(id)
        .populate([
          {
            path: "plans",
          },
        ])
        .lean();
    res.send({
      status: "200",
      movieDetailData: model,
    });
  });
  // 6.获取即将上映电影数据(首页、电影页)
  router.get("/willMovie", async (req, res) => {
    // 即将上映部分
    const now = new Date();
    const model = await Movie.find().lean();
    // 即将上映电影的上映日期必须要在今天之后
    const data = model.filter((item) => {
      return new Date(item.inDate) > now;
    });
    res.send({
      status: "200",
      willMovieData: data,
    });
  });
  //获取正在上映电影数据
  router.get("/nowMovie", async (req, res) => {
    // 即将上映部分
    const model = await Plan.find().populate('movieId').lean();
    res.send({
      status: "200",
      nowMovieData: model,
    });
  });

  //上传海报
  router.post('/movie/upload', upload, async (req, res) => {
    const file = req.file
    file.url = `http://localhost:3000/uploads/movieIcon/${file.filename}`
    res.send(file)
  });
  app.use('/admin/api', router)//挂载到路由上

}
