const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");


const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },
    category: {
        type: String,
       // required: true
    },
    salary: {
        type: String,
        required: true
    },    
    description: {
        type: String,
        required: true
    },
    
    date: {
        type: Date,
        default: Date.now(),
        required: true
    },
    icon: {
        type: String,
        default: "icon"
        //////////////////////////////////////////
    },
    deadline: {
        type: Date,
        
    }

});

module.exports = mongoose.model('Jobs', jobSchema);