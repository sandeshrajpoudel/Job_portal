const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const Jobs = require("./Jobs");
const Users = require("./Users");

const jobSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Jobs
    },    
    applied_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users
    },
    resume:{
        type:String,
        required : true
    },
    date: {
        type: Date,
        default: Date.now(),
    },

})