import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";
import Forgotpassword from "../pages/Forgotpassword";
import VerifyEmail from "../pages/verifyEmail";
import Routers from "./router";
const router = createBrowserRouter([
{
    path : "/",
    element : <App/>,
    children : [
        {
            path : "register",
            element :<RegisterPage/>
        },
        {
            path : 'login',
            element :<CheckEmailPage/>
        },
        {
            path : 'forgot-password',
            element : <Forgotpassword/>
        },
        {
            path : "verifyemail",
            element :<VerifyEmail/>
        },
        {    
            path : "",
            element :<Routers><Home/></Routers>,
            children : [
                {
                    path : ':userId',
                    element : <MessagePage/>
                }
            ]
            
        }
    ]
}
])

export default router