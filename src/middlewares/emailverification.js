var resetMethod = {
    randomFixedInteger: async function (length) {
        return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
    },
    emailVerification: async function (email,tokenCode) {
       // console.log("1")
        // create reusable transporter object using the default SMTP transport
        try {
            let transporter = nodemailer.createTransport({
                service: "Gmail",
            auth: {
                    user: process.env.EMAIL, //mail used to send mail
                    pass: process.env.PASSWORD, // pw for mail
                },
            });
         //   console.log("3")
            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Finder App" <sandeshrajpoudel11@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Confirmation Mail", // Subject line
                text: tokenCode, // plain text body
                //html: tokenCode, // html body
            });
            console.log("4")
        } catch (ex) {
            console.log(ex.toString());
        }
        //console.log("message sent");
    }
}
module.exports = resetMethod;