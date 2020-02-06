const express = require('express');
const router = express.Router();

/*use the product table model*/
//authentication file
const checkAuth = require ('../middleware/check-auth');

//bring in users controller
const UsersControllers = require('../controllers/users');

//all users
router.get('/',checkAuth, UsersControllers.users_view_all_user);
//user login
router.post('/login',UsersControllers.users_user_login)
//user sign up
router.post('/signup',UsersControllers.users_create_signup);
//remove a user
router.delete('/:email',checkAuth, UsersControllers.users_delete_usre);

//export the servlet to the server
module.exports = router;