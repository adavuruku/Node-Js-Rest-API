const mongoose = require('mongoose');
const Users = require('../models/user');
const jwt = require('jsonwebtoken');


const bcrypt = require('bcrypt');

//user view all the users
exports.users_view_all_user = (req,res,next)=>{
    Users.find().select('email password _id').exec()
    .then(doc =>{
        const response={
            count: doc.length,
            products: doc.map(doc=>{
                return {
                    myId : doc.email,
                    myPassword:doc.password,
                    request :{
                        type:"GET",
                        url:"http://localhost:3000/users/login"
                    }
                }
                
            })
        };
        //console.log(response);
        if(doc){
            res.status(200).json(response);
        }else{
            res.status(200).json({message: 'No Records In Users table'});
            //console.log(doc);
        }
        
    }).catch(err=> {
        console.log(err);
        res.status(500).json({error:err});
    });
}

//user login
exports.users_user_login = (req,res,next)=>{
    Users.find({email:req.body.email}).select('email password _id')
    .exec()
    .then(user=>{
        if(user.length <1){
            return res.status(404).json({
                message: 'Authentication Failed !!'
            })
        }
        bcrypt.compare(req.body.password, user[0].password,(err,result)=>{
            if(err){
                return res.status(401).json({
                    message:'Authentication failed'
                });            
            }
            if(result){
                //return res.status(200).json({
                  //  message:'Authentication Successful'
               // }) 
               //create a web tokeb - from jwt library
                const token = jwt.sign({
                    email:user[0].email,
                    userId: user[0]._id
                },
                //process.env.JWT_KEY,
                "secret",
                {
                    expiresIn:"1h"
                });
               //console.log(user.email);
                return res.status(200).json({
                    message:'User Found !!',
                    user:{
                        email:user[0].email,
                        pwo : user[0].password,
                        token:token
                    }
                });          
            }

            res.status(401).json({
                message:'Authentication failed'
            })      

        });
        
    })
    .catch(err=>{
        res.status(500).json({
            message: 'faill',
            Error: err
        });
    })
}


exports.users_create_signup = (req,res,next)=>{
    Users.find({email:req.body.email}).exec()
    .then(doc=>{
        if(doc.length >=1){
            return res.status(409).json({
                message:'User Already Exist !!'
            });
        }else{
            bcrypt.hash(req.body.password,10,(err, hash)=>{
                if(err){
                    return res.status(500).json({
                        error:err
                    });
                }else{
                    //console.log(hash);
                    const user = new Users({
                        _id : mongoose.Types.ObjectId(),
                        email :req.body.email,
                        password : hash
                    });
                    user.save()
                    .then(doc=>{
                        res.status(201).json({
                            message:'User Created !!',
                            user:{
                                _id:doc._id,
                                email:doc.email,
                                pwor:doc.password
                            }
                        });
                    }).catch(err=>{
                        res.status(500).json({
                            message: 'faill',
                            Error: err
                        });
                    });
                }
            });
        }
    });
    
}


//delete or remove a user
exports.users_delete_usre = (req,res,next)=>{
    var email = req.params.email;
    Users.remove({email:email}).exec()
    .then(result=>{
        res.status(200).json({
            message:'User Removed !!'
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
}