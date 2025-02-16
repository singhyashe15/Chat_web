

const GetToken = async (req, res) => {

  const token = req.cookies.token;
  console.log("token get ", req.cookies.token)
  if (token) {
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

export default GetToken;
