import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config()
const Transporter = createTransport({
  service:'gmail',
    auth:{
        user: process.env.EMAIL_USER, //email address
        pass: process.env.EMAIL_PASS // password
    }
})

export default Transporter