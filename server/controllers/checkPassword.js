import UserModel from '../models/user.js';
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const  checkPassword = async(request,response) => {
    try {
        const { email,password } = request.body
        const user = await UserModel.findOne({email:email})
        if(!user) {
            return response.status(400).json({
                message:"Do check your email",
                error:true
            })
        }
        const verifyPassword = await bcryptjs.compare(password,user.password)

        const jwtsecret = process.env.JWT_SECRET_KEY
        
        if(!verifyPassword){
            return response.status(400).json({
                message : "Do check your password",
                error : true
            })
        }
        const tokenData = {
            id : user._id,
            email : user.email,
        }
        
        // const jwtsecret = process.env.JWT_SECRET_KEY
        const token =  jwt.sign(tokenData,jwtsecret,{ expiresIn : '5d'})
       
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
            error : error
        })
    }
}

export default checkPassword 