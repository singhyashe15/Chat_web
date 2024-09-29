import express from 'express'
import registerUser from '../controllers/register.js'
import checkPassword from '../controllers/checkPassword.js'
import userDetails from '../controllers/userdetails.js'
// const logout = require('../controllers/logout')
import updateUserDetails from '../controllers/updatedetails.js'
import searchUser from '../controllers/search.js'
import deleteMsg from '../controllers/deletemsg.js'
import VerifyEmail from '../controllers/auth.js'

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

router.post("/verifyemail",VerifyEmail)

export default router