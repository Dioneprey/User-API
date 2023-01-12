var jwt = require("jsonwebtoken")
var secret = "something"


module.exports = function(req, res, next) {

    const authToken = req.headers['authorization']

    if(authToken != undefined){
        const bearer = authToken.split (' ')
        var token = bearer[1]
        try {
            var decoded = jwt.verify(token,secret)    
            
            if(decoded.role == 1){
                next()
            } else {
                res.status(403).send("Access Denied you don't have permission to access")
                return
            }

            
        }catch{
            res.status(403).send("You are not logged in")
            return
        } 
        

    }else{
        res.status(403).send("You are not logged in")
        return
    }

}