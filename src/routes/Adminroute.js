const express = require("express");
const Routers = express.Router();
const Users = require('../models/Users')
const Jobs = require('../models/Jobs')
const Applications = require('../models/Applications')
const { body, validationResult } = require('express-validator');
const handleValidationErrors = require("../middlewares/handleValidationErrors")
const JWT = require("../middlewares/auth")
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        return cb(null, 'uploads/jobs');
    },
    filename: (req, file, cb) => {
        console.log("filename: " + file.fieldname + Date.now() + path.extname(file.originalname))
        console.log(file)
        return cb(null, file.fieldname + path.extname(file.originalname))
    }
});
const upload = multer({
    storage: storage
}).single('icon');



Routers.get("/addjobs",
    JWT.verifyAdmin,
    async (req, res) => {
        res.json({
            status: "Success",
            message: "now u can post jobs"
        });


    });

Routers.get("/cpanel/login", async (req, res) => {
    res.json({
        status: "Success",
        message: ""
    });

});
Routers.post("/addjobs",
    [
        body('title')
            .isLength({ min: 3 })
            .isEmpty().withMessage("title cant be empty"),

        body('salary')
            .isLength({ min: 3 })
            .isEmpty().withMessage("salary cant be empty"),
        body('description')
            .isLength({ min: 10 }).withMessage("description ")
            .isEmpty().withMessage("fields cant be empty"),
        body('type')
            .isLength({ min: 3 })
            .isEmpty().withMessage("Provide proper Job type"),
    ],
    JWT.verifyAdmin,
    upload,
    async (req, res) => {
        try {
            let icon = req.file.path;
            console.log("111111111111111")
            if (!icon) {
                icon = "Finder Jobs icon default"
            }

            let postJobs = new Jobs({
                title: req.body.title,
                description: req.body.description,
                icon: icon,
                type: req.body.type,
                salary: req.body.salary,
                // deadline: req.body.deadline,
                category: req.body.category,

            })

            await postJobs.save()
            res.json({
                status: "success",
                message: postJobs
            })

        } catch (error) {
            console.log(error)
            res.json({
                status: "error",
                message: error.message
            })

        }
    });

Routers.put('/:id',
    [
        body('title')
            .isLength({ min: 3 })
            .isEmpty().withMessage("title cant be empty"),

        body('salary')
            .isLength({ min: 3 })
            .isEmpty().withMessage("salary cant be empty"),
        body('description')
            .isLength({ min: 10 }).withMessage("description ")
            .isEmpty().withMessage("fields cant be empty"),
        body('type')
            .isLength({ min: 3 })
            .isEmpty().withMessage("Provide proper Job type"),
    ],
    handleValidationErrors(),
    JWT.verifyAdmin,
    upload,
    async (req, res) => {
        try {
            const Findjobs = await Jobs.findById({
                _id: req.params.id
            })
            Findjobs.title = req.body.title,
                Findjobs.description = req.body.description,
                Findjobs.thum_img = req.file.filename,
                Findjobs.type = req.body.type,
                Findjobs.salary = req.body.salary,
                Findjobs.deadline = req.body.deadline


            await FindNotices.save();

            res.json(FindNotices);

        } catch (error) {
            console.log(error)
            res.json({
                status: "error",
                message: error.toString
            })

        }


    });




Routers.delete('/:id',
    JWT.verifyAdmin,
    async (req, res, next) => {
        try {
            const del_job = await Jobs.findById({
                _id: req.params.id
            })

            const del = await del_job.remove()
            res.json({
                status: 'successfull',
                message: 'deleted'
            })

        } catch (error) {
            res.json({
                status: "error",
                message: error
            })

        }

    });

module.exports = Routers;