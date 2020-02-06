const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
    try{

        //authorization sending token with the body
       // const decoded = jwt.verify(req.body.token, "secret");

       //authorization sending token with the header - authorization header
       const token = req.headers.authorization.split(" ")[1];
       const decoded = jwt.verify(token, "secret");
        req.userData = decoded;
        //console.log(req.body.token);
        next();
    }catch(error){
        //console.log(req.body.token);
        res.status(401).json({
            message:'Auth Failled - check !!!'
        });
    }
    
}