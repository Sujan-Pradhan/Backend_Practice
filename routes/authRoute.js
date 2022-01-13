const router = require("express").Router();

const {
  userRegister,
  postEmailConfirmation,
  userSignIn,
  signOut,
  forgetPasword,
  resetPassword,
  userList,
  singleUser,
  resendVerificationMail,
  requireSignin,
  updatePassword,
} = require("../controllers/authController");

router.post("/register", userRegister);
router.post("/confirmation/:token", postEmailConfirmation);
router.post("/signin", userSignIn);
router.post("/signout", requireSignin, signOut);
router.post("/forgetpassword", forgetPasword);
router.put("/resetpassword/:token", resetPassword);
router.get("/userlist", requireSignin, userList);
router.get("/singleuser/:id", requireSignin, singleUser);
router.post("/resendverification", resendVerificationMail);
router.put("/updatepassword/:id", updatePassword);
module.exports = router;
