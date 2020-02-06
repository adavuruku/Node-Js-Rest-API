const mongoose = require('mongoose');
const Orders = require('../models/order');
const Product = require('../models/product');


exports.orders_get_all = (req,res,next)=>{
    Orders.find().select('_id product quantity')
    .populate('product','name')
    .exec()
    .then(doc =>{
        const response={
            count: doc.length,
            orders: doc.map(doc=>{
                return {
                    myId : doc._id,
                    productID:doc.product,
                    noQty: doc.quantity,
                    request :{
                        type:"GET",
                        url:"http://localhost:3000/orders/" + doc._id
                    }
                }
                
            })
        };
        //console.log(response);
        if(doc){
            res.status(200).json(response);
        }else{
            res.status(200).json({message: 'No Records In PRODUCTS table'});
        }
        
    }).catch(err=> {
        console.log(err);
        res.status(500).json({error:err});
    });
}

exports.Orders_create_order = (req,res,next)=>{
    Product.findById(req.body.productId).exec()
    .then(product=>{
        if(!product){
            return res.status(404).json({
                message: 'OOps No Such Product With The Id !!'
            });
        }
        const order = new Orders({
            _id : mongoose.Types.ObjectId(),
            product :req.body.productId,
            quantity :req.body.quantity
        });
        return order.save();
    })
    .then(result=> {
        console.log(result);
        res.status(201).json({
            message: 'New Order Created !!',
            product : {
                _id: result._id,
                product:result.product,
                quantity:result.quantity
            }
        });
    })
    .catch(err=> {
        console.log(err);
        res.status(404).json({
            message: 'OOps Faill To Create New Order !!',
            error:err
        });
    });
}

exports.Orders_get_Order = (req,res,next)=>{
    var id = req.params.orderId;
    Orders.findById(id)
    .populate('product')
    .exec() //u can remove the select keyword to select all columns
    .then(doc =>{ 
        console.log(doc);
        if(doc){
            res.status(200).json({
                message:'Order Found !!',
                order : {
                    Oid: doc._id,
                    name:doc.product.name,
                    price:doc.product.price,
                    qty: doc.quantity
                }
            });
        }else{
            res.status(200).json({message: 'Product Does nOT eXIST'});
        }
        
    }).catch(err=> {
        console.log(err);
        res.status(500).json({error:err});
    });
}

exports.Orders_delete_order = (req,res,next)=>{
    var id = req.params.orderId;
    Orders.remove({_id:id}).exec()
    .then(result=>{
        res.status(200).json(result);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
}