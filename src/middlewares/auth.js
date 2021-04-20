const dotenv = require('dotenv').config();
const jwt = require("jsonwebtoken");
const Notices = require("../models/Jobs");
const Users = require('../models/Users');
const mongoose = require('mongoose')
const RegRouter = require("../routes/registerRouter.js")
const multer = require('multer');
const path = require('path');

const JWT = {

    verifyuser: async (req, res, next) => {
        try {
            const token = req.header("Authorization").split(" ")[1];
            if (token) {
                const verUser = jwt.verify(token, process.env.SECRET_KEY)
                next();
            } else {
                res.json({
                    status: "fail",
                    data: { message: "unauthorized, login first" }
                });
            }

        } catch (error) {
            console.log(error.toString())
            res.json({
                status: "error",
                data: { "error": { message: "login first" } }
            });
        }
    },

    verifyAdmin: async (req, res, next) => {
        try {
            console.log("stuck in middleware")

            if (!req.header("Authorization")) {
                res.json({
                    status: "Fail",
                    data: { message: "unauthorized" }
                });
            }

            const token = req.header("Authorization").split(" ")[1];
           // console.log(process.env.SECRET_KEY)
            const verifyadmin = jwt.verify(token, process.env.SECRET_KEY)
                        console.log(verifyadmin)
                        

            if (verifyadmin.roles === "ADMIN") {
                 console.log('a');
              
                 next();

            } else {
                res.json({
                    status: "fail",
                    data: { message: "not valid user" }
                })
            }
        } catch (error) {
            res.json({
                status: "error",
                data: { "error": { message: "not valid user" } }
            });
        }
    },
    generateNewToken: function (payload) {
        return jwt.sign(payload, process.env.SECRET_KEY);
    },

      
    
    

 uploadmidd: multer({
    
    storage: multer.diskStorage({
        destination: (req, res, cb) => {
           
              return  cb(null, 'uploads/profile');
            
    
    
        },
        filename: (req, file, cb) => {
            console.log("filename: " + file.fieldname + Date.now() + path.extname(file.originalname))
            console.log(file)
            return cb(null, file.fieldname + path.extname(file.originalname))
        }
    })

}).single('icon')

}


module.exports =JWT;