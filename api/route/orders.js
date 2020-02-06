//servlet - takes care of request and reponse

//request for express framework
const express = require('express');
const router = express.Router();
/*use the product table model*/

//authentication file
const checkAuth = require ('../middleware/check-auth');

//bring in orders controller
const OrdersControllers = require('../controllers/orders');

//retrieve al the prders
router.get('/',checkAuth, OrdersControllers.orders_get_all);
//create a new order
router.post('/',checkAuth, OrdersControllers.Orders_create_order);
//view a single order
router.get('/:orderId',checkAuth, OrdersControllers.Orders_get_Order);
//delete an order
router.delete('/:orderId',checkAuth, OrdersControllers.Orders_delete_order);

//export the servlet to the server
module.exports = router;