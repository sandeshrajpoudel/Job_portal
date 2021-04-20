const express = require("express");
const Router = express.Router();
const Users = require('../models/Users')
const Jobs = require('../models/Jobs')
const Applications = require('../models/Applications')
const { body, validationResult } = require('express-validator');
const handleValidationErrors = require("../middlewares/handleValidationErrors");

const JWT = require("../middlewares/auth")


Router.get("/jobs", async (req, res) => {

    try {
        const jobs = await Jobs.find()
        res.json(jobs)
    }
    catch (error) {
        console.log(error)
        res.json({
            status: "error",
            message: ""
        })
    }
});


Router.post('/jobs/apply/:id',
    [
        body('resume')
            .isLength({ min: 2 }).withMessage("upload CV file")
    ],

    // handleValidationErrors(),
    //  JWT.uploadmidd,
    JWT.verifyuser,
    async (req, res, next) => {
        try {
            const header_token = req.header("Authorization").split(" ")[1];
            let user_id = header_token
            let applyJob = new Applications({
                job: req.body.job,
                applied_by: user_id,
                resume: req.file.filename,
            })
            await applyJob.save()
            res.json({
                status: "success",
                message: applyJob
            })
        } catch (error) {
            console.log(error.toString());
            res.json({
                status: "error",
                message: error.message
            })
        }
    });
module.exports = Router;