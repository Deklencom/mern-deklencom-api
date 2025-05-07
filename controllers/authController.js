// const jwt = require("jsonwebtoken")
// const expressJWT = require("express-jwt")

// exports.login=(req,res)=>{
//     const {username,password} = req.body
//     if(password === process.env.PASSWORD){
//         const token = jwt.sign({username},process.env.JWT_SECRET,{expiresIn:'1d'})
//         return res.json({token,username})
//     }else{
//         return res.status(400).json({ error: "Something went wrong!" });
//     }
// }

// // Check token
// exports.requireLogin=expressJWT({
//     secret:process.env.JWT_SECRET,
//     algorithms:["HS256"],
//     userProperty:"auth"
// })

const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required!" });
  }

  if (password === process.env.PASSWORD) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.json({ token, username });
  } else {
    return res.status(400).json({ error: "Invalid credentials!" });
  }
};

// Check token without `express-jwt`
exports.requireLogin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token!" });
    }
    req.auth = decoded;
    next();
  });
};
