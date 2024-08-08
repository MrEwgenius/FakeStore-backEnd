const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
        user: "ebolynskii@mail.ru",
        pass: "v",
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

