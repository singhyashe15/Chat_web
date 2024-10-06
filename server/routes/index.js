import express from 'express'
import registerUser from '../controllers/register.js'
import checkPassword from '../controllers/checkPassword.js'
import userDetails from '../controllers/userdetails.js'
// const logout = require('../controllers/logout')
import updateUserDetails from '../controllers/updatedetails.js'
import searchUser from '../controllers/search.js'
import deleteMsg from '../controllers/deletemsg.js'
import VerifyEmail from '../controllers/auth.js'
import ResetPassword from '../controllers/reset-password.js'
import verify from '../controllers/verify.js'

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
// handle  the delete msg
router.post("/deletemsg",deleteMsg)
// verfiying the code
router.post("/verifyemail",VerifyEmail)
// reset the password
router.post('/reset-password',ResetPassword)
// verifing the email
router.post('/verify',verify)

export default router