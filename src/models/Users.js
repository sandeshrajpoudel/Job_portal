
const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true

    },
    icon: {
        type: String,
        


    },
    password: {
        type: String,
        required: true

    },
    phone: {
        type: String,
        // required: true,
        maxLength: 10
    },
    address: {
        type: String,
        default: "Gandaki province Nepal"
    },
    age: {
        type: String,
        default: "22"
    },
    roles: {
        type: String,
        default: "USER",
        enum: ["USER", "ADMIN"]
    },
    isVerified:{
        type: Boolean,
        default: false,

    }
});





module.exports = mongoose.model('Users', userSchema);






