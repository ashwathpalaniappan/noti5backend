const mailer = require("nodemailer");
const { Hello } = require("./hello_template");
require("dotenv").config();


const getEmailData = (to,name,id) => {
    let data = null;
            data = {
                from: `noti5 app <noti5application@gmail.com>`,
                to,
                subject: `Mail Verification for noti5 app`,
                html: Hello(name,id)
            }
    return data;
}


const sendEmail = (email,name,id) =>{
    const smtpTransport = mailer.createTransport({
        service: "Gmail",
        auth: {
            user: "noti5application@gmail.com",
            pass: "qwerty@123"
        }
    })

    const mail = getEmailData(email,name,id);
    console.log(id);
    smtpTransport.sendMail(mail, function(error, response) {
        if(error) {
            console.log(error)
        } else {
            console.log( " email sent successfully")
        }
        smtpTransport.close();
    })


}

module.exports = { sendEmail }