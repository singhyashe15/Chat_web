const UserModel = require("../models/user")
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function checkPassword(request,response){
    try {
        const { email,password } = request.body
        console.log(email)
        const user = await UserModel.findOne({email:email})
        console.log(user)
        console.log(password)
        const verifyPassword = await bcryptjs.compare(password,user.password)
        if(!verifyPassword){
            return response.status(400).json({
                message : "Please check password",
                error : true
            })
        }

        const tokenData = {
            id : user._id,
            email : user.email,
        }
        
        const jwtsecret = "7a9e6f8c4b2d1c3f5a7b6e9f0d1e4a5c"

        const token =  jwt.sign(tokenData,jwtsecret,{ expiresIn : '2d'})
        console.log("TOken " + token)
        const cookieOptions = {
            http : true,
            secure : true,
            sameSite : 'None'
        }
       
        return response.cookie('token',token,cookieOptions).status(200).json({
            message : "Login successfully",
            token : token,
            success :true
        })

    } catch (error) {
        return response.status(500).json({
            message : "Some error is there",
            error : true
        })
    }
}

module.exports = checkPassword