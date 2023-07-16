
const jwt = require("jsonwebtoken")
const secret = "lucky_k"
const JWT = {
    //生成token
    generate(value){
        return jwt.sign(value,secret)
    },
    //校验
    verify(token){
        try {
            return jwt.verify(token,secret)
        } catch (error) {
            return false
        }
    }
}


module.exports = JWT