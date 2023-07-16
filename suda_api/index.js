const express = require("express");
const app = express()

app.use(require('cors')())
app.use(express.json())
app.use('/uploads',express.static(__dirname+'/uploads'))

require('./config/db_config')(app)
require('./routes/admin/movie')(app)
require('./routes/admin/category')(app)
require('./routes/admin/user')(app)
require('./routes/admin/plan')(app)
require('./routes/admin/advertise')(app)
require('./routes/admin/hall')(app)
require('./routes/admin/order')(app)

//设置跨域
app.all("*", function(req, res, next) {
    if (!req.get("Origin")) return next();
    // use "*" here to accept any origin
    res.set("Access-Control-Allow-Origin","*");
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "X-Requested-With,Origin,Content-Type,Accept");
    // res.set('Access-Control-Allow-Max-Age', 3600);
    if ("OPTIONS" === req.method) return res.sendStatus(200);
    next();
});
app.listen(3000,()=>{
    console.log('http://localhost:3000')
});
