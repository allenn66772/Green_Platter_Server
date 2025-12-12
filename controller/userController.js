const users = require("../model/userModel");
const jwt = require("jsonwebtoken");

//register
exports.registerController = async (req, res) => {
  console.log("Inside register user controller");

  const { username, password, confirmpassword, email } = req.body;
  console.log(username, password, confirmpassword, email);

  //logic
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      res.status(404).json("User already exists.... Please login");
    } else {
      const newUser = new users({
        username,
        email,
        password,
        confirmpassword,
      });
      await newUser.save();
      res.status(200).json(newUser);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//login
exports.loginController = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const existingUser = await  users.findOne({ email });
    if (existingUser) {
      if (existingUser.password == password) {
        const token = jwt.sign(
          { userMail: existingUser.email, role: existingUser.role },
          process.env.JWtSecretKey
        );
        res.status(200).json({ existingUser, token });
      } else {
        res.status(401).json("Invalid Credntials");
      }
    } else {
      res.status(404).json("User Not Found Please Register");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
