const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const routers = express.Router();

const mongoose = require("mongoose");
const { body, validationResult } = require('express-validator');
const bodyParser = require("body-parser");
const RegRouter = require("./routes/registerRouter")
const JobRouter = require("./routes/Jobrouter")
const Adminrouter= require("./routes/Adminroute")





const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
    
}).then(() => {
    console.log("connected to database")
})
    .catch((error) => {
        console.log(error)
    })

app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use("/resumes", express.static("resumes"));
app.use(express.json());

app.use('/api/finder/admin', Adminrouter);
app.use('/api/finder',RegRouter);
app.use('/api/finder', JobRouter);


routers.get("/",
    async (req, res) => {
        res.json({
            status: "Success",
            message: "Successful api fetching"
        });


    });


app.listen(PORT, () => {
    console.log(`server listening at   http://localhost:${PORT}/api/finder  ......../`);

});