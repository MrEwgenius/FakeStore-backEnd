const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
        user: "ebolynskii@mail.ru",
        pass: "RshLxXxqgD1NXss3xaMv",
    },

},
    {
        from: '"Дядя Женя 👻" <ebolynskii@mail.ru>',

    },
);



const success = message => {
    transporter.sendMail(message, (err, info) => {
        if (err) return console.log(err);
    })
}

module.exports = success

