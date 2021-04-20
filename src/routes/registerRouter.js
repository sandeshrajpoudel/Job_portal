const express = require("express");
const Users = require('../models/Users');
const tokens = require('../models/tokens');
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');
const validator = require("validator");
const router = express.Router();
const handleValidationErrors = require("../middlewares/handleValidationErrors")
const nodemailer = require("nodemailer");
const JWT = require("../middlewares/auth");
const resetMethod = require("../middlewares/emailverification")
const multer = require("multer");
const path = require("path")




const storage = multer.diskStorage({
    destination: (req, res, cb) => {

        return cb(null, 'uploads/profile');



    },
    filename: (req, file, cb) => {
        console.log("filename: " + file.fieldname + Date.now() + path.extname(file.originalname))
        console.log(file)
        return cb(null, file.fieldname + path.extname(file.originalname))
    }
})
const uploadprofile = multer({

    storage: storage

}).single('icon')



//render register page
router.get('/register', function (req, res) {
    res.send("API Registration Route");
});

//register user
router.post('/register', [
    body('name')
        .isLength({ min: 1 }).withMessage("name cant be empty"),
    body('email').isEmail().withMessage("not a valid email")
        .isLength({ min: 10 }).withMessage("email not valid"),
    body("confirm_password").exists(),
    body("password", "Password must be between 8 and 64 characters.").isLength({ min: 5, max: 64 }).custom(async (inputPassword, { req: req }) => {
        return inputPassword === req.body.confirm_password ? Promise.resolve("Passwords match.") : Promise.reject("Passwords dont match.");
    }),
],

    async (req, res) => {
        try {

            const emailExists = await Users.findOne({
                email: req.body.email
            });

            if (emailExists) {
                res.json("email already exists");

            } else {
                const hash_password = await bcrypt.hash(req.body.password, 10);
                //console.log('1')


                const reguser = new Users({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash_password,
                    // phone: req.body.phone,
                    // address: req.body.address,
                    // age: 
                });
                await reguser.save();
                res.json(reguser);
            }
        } catch (error) {
            res.json(error.toString())
        }
    });

//render login page
router.get('/login',
    (req, res) => {
        res.json("login page");
    })

//login user
router.post('/login',
    body('email').isEmail().withMessage("not a valid email")
        .isLength({ min: 10 }).withMessage("email not valid"),
    body('password')
        .isLength({ min: 5 }).withMessage("password must be  6 character long"),
    async (req, res) => {
        try {
            //  console.log("1")
            const userEmail = await Users.findOne({ email: req.body.email });
            const password_check = await bcrypt.compare(req.body.password, userEmail.password);

            if (userEmail == null) {
                return res.json({
                    status: "fail",
                    data: { message: 'Username doesnt exists.' }
                });
            }
            else if (!password_check) {
                return res.json({
                    status: "fail",
                    data: { message: 'password not matching.' }
                });
            } else {

                const token = JWT.generateNewToken({ userId: userEmail._id, email: userEmail.email, roles: userEmail.roles })
                res.header('auth-token', token);
                return res.json({
                    status: "Success",
                    data: { userEmail }
                })
            }
        } catch (error) {
            console.log(error.toString());
            res.json(error);
        }
    });



//edit users basic details
router.put("/user",
    [
        body('email').optional().isEmail()
            .withMessage("Not a valid mail!!").isString(),

        body('phone').optional().isMobilePhone().withMessage("Not a valid phone number")
            .isLength({ min: 9, max: 10 }).withMessage("phone number length not valid")
            .isString().optional()
    ],

    JWT.verifyuser,
    uploadprofile,

    async (req, res) => {

        try {
            const user = req.jwt.user;
            const profile = 0;

            if (req.body.email) {
                user.email = req.body.email;
                profile = profile + 1;
            }
            else if (req.body.phone) {
                user.phone = req.body.phone;
                profile = profile + 1;
            }
            else if (req.body.age) {
                user.age = req.body.age;
                profile = profile + 1;
            }
            else if (req.body.address) {
                user.address = req.body.address;
                profile = profile + 1;
            }
            else if (req.file.path) {
                user.icon = req.file.path;
                profile = profile + 1;

            } else if (profile >= 5) {
                user.isVerified = true;
            }
                await user.save((error, result) => {
                    if (error) return res.json({ status: "error", message: error.message });
                    return res.json({ status: "success", data: { user: result } });
                });
            
        } catch (ex) {
            return res.json({status: "error", message: ex.message});
        }
    });

//reset password(send verification code)

router.post("/user/reset", [
    body("email", "Invalid email address").normalizeEmail().isEmail()
],
    async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email }).exec();
            if(!user){
                return Promise.reject("User with that email doesnt exists");
            }
            // console.log("1")
            var recursion = async function () {
                //  console.log("1")
                tokenCode = (await (resetMethod.randomFixedInteger(6))).toString()
                // console.log("2")
                const tokenCheck = await tokens.findOne({ token_number: tokenCode });
                const Email = await tokens.findOne({ "email": req.body.email });
                //console.log("3")
                if (!tokenCheck) {
                    if (Email) {
                        // console.log("12")
                        // console.log("  hi" + await (del_token).toString())
                        await Email.remove();
                    }
                    const createToken = new tokens({
                        token_number: tokenCode,
                        //  user_ID: ID
                    })
                    await createToken.save();
                    // console.log("1111111"+Email)
                    resetMethod.emailVerification(Email, tokenCode);
                    return res.json({
                        status: "success",
                        body: {
                            createToken
                        }
                    })
                } else {
                    recursion();
                }
            }
            recursion();
        } catch (error) {
            res.json({
                status: "error",
                // data: "Some internal server error occurred."
                data: error.toString()
            });
        }
    })

//enter verification code and change password

router.put("/user/reset", [
    body("token_number", "token must be of 6 character.").exists().isLength({ min: 5 }),
    body("confirm_password").exists(),
    body("password", "Password must be between 8 and 64 characters.").isLength({ min: 8, max: 64 }).custom(async (inputPassword, { req: req }) => {
        return inputPassword === req.body.confirm_password ? Promise.resolve("Passwords match.") : Promise.reject("Passwords dont match.");
    }),
],
    handleValidationErrors(),
    async (req, res, next) => {
        console.log("1")
        const expiryDuration = 5 * 60 * 1000; //3 minutes duration in milisecond  after 3 minutes the token will be expired
        const id = await tokens.findOne({ "user_ID": req.body.id }, {
            "date": 1, "_id": 1, "token_number": 1
        })
        console.log(id)
        console.log("id.date" + Date.parse(id.date))
        if (id) {
            if (Date.now() - Date.parse(id.date) <= expiryDuration) {
                const user = await User.findById({ "_id": id._id })
                console.log("3")
                return bcrypt.hash(req.body.password, 10).then(async (hash_Password) => {
                    user.password = hash_Password;
                    await user.save();
                    return res.json({
                        status: "success",
                        data: { User }
                    })
                })
            }
        } else {
            res.json({
                status: "fail",
                data: { message: "Your token is invalid!! Try again" }
            })
        }
        try {
        } catch (error) {
            res.json({
                status: "error",
                data: "Some internal server error occurred."
            });
        }
    })




module.exports = router;