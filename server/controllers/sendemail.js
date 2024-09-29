import Transporter from "./transport.js";

  const  sendEmail = async(email,code,user_email,user_pass) => {
    try {
        const info = Transporter.sendMail({
            from: user_email, // sender address
            to: email, // list of receivers
            subject: "Verify Email", 
            html: `<h2>Hii there</h2> </br> 
                   <p> Your Verification Code: ${code}
                  </p>`
        });
    } catch (error) {
        console.log(error)
    }
   
  }

  export default sendEmail

