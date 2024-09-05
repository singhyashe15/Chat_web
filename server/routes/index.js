const express = require('express')
const registerUser = require('../controllers/register')
const checkPassword = require('../controllers/checkPassword')
const userDetails = require('../controllers/userdetails')
// const logout = require('../controllers/logout')
const updateUserDetails = require('../controllers/updatedetails')
const searchUser = require('../controllers/search')
const deleteMsg = require('../controllers/deletemsg')
const router = express.Router()

//create user api
router.post('/register',registerUser)
//check user user
router.post('/email',checkPassword)
//login user details
router.post('/user',userDetails)
//logout user
// router.get('/logout',logout)
//update user details
router.post('/update-user',updateUserDetails)
//search user
router.post("/search-user",searchUser)
router.post("/deletemsg",deleteMsg)

module.exports = router