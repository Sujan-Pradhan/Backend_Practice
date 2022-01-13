const User = require("../models/authModel");
const Token = require("../models/tokenModel");
const sendEmail = require("../utils/setEmail");
const crypto = require("crypto");
const jwt = require("jsonwebtoken"); //for authentication
const expressJwt = require("express-jwt"); //authorization

//register user and send emaail confirmation link

exports.userRegister = async (req, res) => {
  //checking if the user is already validate or not
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).json({ error: "Email already exists" });
  }
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  user = await user.save();
  if (!user) {
    return res.status(400).json({ error: "Something went wrong" });
  }

  let token = new Token({
    token: crypto.randomBytes(16).toString("hex"),
    userId: user._id,
  });
  token = await token.save();
  if (!token) {
    return res.status(400).json({ error: "Something went wrong" });
  }

  //sendEmail

  sendEmail({
    from: "no-reply@pradhan.com",
    to: user.email,
    subject: "Email verification link",
    text: `Hello ${user.name} \n\n Please confirm your email by copying the below link: \n\n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`,
  });
  res.send(user);
};

//post email confirmation
exports.postEmailConfirmation = async (req, res) => {
  //at first find the valid or matchin token
  Token.findOne({ token: req.params.token }, (error, token) => {
    if (error | !token) {
      return res
        .status(400)
        .json({ error: "Invalid token or token has expired" });
    }
    User.findOne({ _id: token.userId }, (error, user) => {
      if (!user | error) {
        return res.status(400).json({ error: "User not found for this token" });
      }
      //check if user is already verified
      if (user.isVerified) {
        return res.status(400).json({
          error:
            "User has been already verified for this token, login to continue",
        });
      }
      //save the verified user
      user.isVerified = true;
      user.save((error) => {
        if (error) {
          return res.status(400).json({ error: error });
        }
        res.json({
          message: "Congratulation you have been verified your email",
        });
      });
    });
  });
};

//signin process
exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;

  //first check the email is registered or not
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Email not found" });
  }
  //check password
  if (!user.authenticate(password)) {
    return res.status(400).json({ error: "Invalid password" });
  }
  //verified or not
  if (!user.isVerified) {
    return res.status(400).json({ error: "Verify berfore proceeding" });
  }
  //generate token using user id and jwt_secret
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  //store token to cookie
  res.cookie("myCookie", token, { expire: Date.now() + 8989898 });

  //information for frontend
  const { _id, role, name } = user;

  return res.json({ token, user: { name, email, _id, role } });
};

//signout
exports.signOut = (req, res) => {
  res.clearCookie("myCookie");
  res.json({ message: "Signout success" });
};

//forgetpassword
exports.forgetPasword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ error: "Email not found" });
  }
  let token = new Token({
    token: crypto.randomBytes(16).toString("hex"),
    userId: user._id,
  });
  token = await token.save();
  if (!token) {
    return res.status(400).json({ error: "Something has happened" });
  }

  //send email
  sendEmail({
    from: "no-reply@pradhan.com",
    to: user.email,
    subject: "Password reset verification link",
    text: `Hello, ${user.name} \n\n Please copy this link to reset password: \n\n http:\/\/${req.headers.host}\/api\/resetpassword\/${token.token}`,
  });
  res.json({ message: "Password reset link has been sent to your mail" });
};

//reset password
exports.resetPassword = async (req, res) => {
  //find the token
  let token = await Token.findOne({ token: req.params.token });
  if (!token) {
    return res
      .status(400)
      .json({ error: "Invalid token or token has been expired" });
  }
  //verified user
  let user = await User.findOne({
    email: req.body.email,
    _id: token.userId,
  });
  if (!user) {
    return res
      .status(400)
      .json({ error: "We are unable to find the valid user for this token" });
  }
  user.password = req.body.password;
  user = await user.save();
  if (!user) {
    return res.status(400).json({ error: "Failed to reset password" });
  }

  res.json({ message: "Password has been reset successfully" });
};

//userlist
exports.userList = async (req, res) => {
  const user = await User.find().select("-hashed_password");
  if (!user) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(user);
};

//singleUser
exports.singleUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-hashed_password");
  if (!user) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(user);
};

//resend verification
exports.resendVerificationMail = async (req, res) => {
  //find register user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(400)
      .json({ error: "Sorry the email you provided not found in our system" });
  }
  //check if user is already verified or not
  if (user.isVerified) {
    return res
      .status(400)
      .json({ error: "Email has already been verfied, login to continue" });
  }
  //create token
  let token = new Token({
    token: crypto.randomBytes(16).toString("hex"),
    userId: user._id,
  });
  token = await token.save();
  if (!token) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  //send email
  sendEmail({
    from: "no-reply@sujanpradhan.com",
    to: user.email,
    subject: "Email resend verification link",
    text: `Hello, \n\n Please confirm your email by copying the below link :\n\n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`,
  });
  res.json({ message: "Verification link has been sent to your mail" });
};

// // update password
// exports.updatePassword = async (req, res) => {
//   const { password } = req.body;
//   const pass = await User.findOne({ password });
//   const oldPassword = await User.compare(password, pass.password);
//   if (!oldPassword) {
//     return res.status(400).json({ error: "Oldpassword is wrong" });
//   }
//   const { newpass, conpass } = req.body;
//   if (newpass !== conpass) {
//     return res.status(400).json({ error: "Password not match" });
//   }
//   const user = await User.findByIdAndUpdate(
//     req.params.id,
//     {
//       password: req.body.newpass,
//     },
//     { new: true }
//   );
//   if (!user) {
//     return res.status(400).json({ error: "Something blunder happened" });
//   }
//   res.json({ message: "Password changed" });
//   res.send();
// };

exports.updatePassword = async (req, res) => {
  // const user = await User.findOne({ password });
  // if (!user) {
  //   return res.status(503).json({
  //     error:
  //       "Sorry the email that you have provided is not found in our system. Please try by using other email",
  //   });
  // }
  let { email, password } = req.body;
  let user1 = await User.findOne({ email });
  if (!user1) {
    return res.status(503).json({
      error:
        "Sorry the email that you have provided is not found in our system. Please try by using other email",
    });
  }

  if (!user1.authenticate(password)) {
    return res.status(400).json({ error: " password invalid" });
  }
  const { newpass, conpass } = req.body;
  if (newpass !== conpass) {
    return res.status(400).json({ error: "Password not match" });
  }
  user1.password = req.body.newpass;
  user1 = await user1.save();
  if (!user1) {
    return res.status(400).json({ error: "Failed to update password" });
  }

  res.json({ message: "Password has been updated successfully" });

  // const user = await User.findByIdAndUpdate(
  //   req.params.id,
  //   {
  //     user.password: req.body.newpass,
  //   },
  //   { new: true }
  // );
  // if (!user) {
  //   return res.status(400).json({ error: "Something went wrong" });
  // }
  // res.send(user);
};

//authorization

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});
