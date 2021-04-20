const mongoose = require("mongoose");
const User = require("./Users");
const typeSchema = new mongoose.Schema({
  
  
  token_number: {
    type: String,
    required: true,
  },
  user_ID:{
      type: mongoose.Schema.Types.ObjectId,
      ref: User
  },
  date: {
      type: Date,
      default: Date.now()
  }

});

const token = mongoose.model("token", typeSchema);
module.exports = token;