const UserModel = require("../models/user")
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function checkPassword(request,response){
    try {
        const { email,password } = request.body
        const user = await UserModel.findOne({email:email})
        
        const verifyPassword = await bcryptjs.compare(password,user.password)
        console.log(verifyPassword)
        const jwtsecret = process.env.JWT_SECRET_KEY
        
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
        
        // const jwtsecret = process.env.JWT_SECRET_KEY
    
        const token =  jwt.sign(tokenData,jwtsecret,{ expiresIn : '2d'})
        const cookieOptions = {
            http : true,
            secure : true,
            sameSite : 'None'
        }
       console.log('token' + token)
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