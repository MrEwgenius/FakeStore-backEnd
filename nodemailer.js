const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "ebolynskii@mail.ru",
        pass: "HPctqLF5TeAsShBtdKWK",
    },

},
    {
        from: '"Дядя Женя 👻" <ebolynskii@mail.ru>',

    },
);

// async..await is not allowed in global scope, must use a wrapper
// async function main() {
//     // send mail with defined transport object
//     const info = await transporter.sendMail({
// from: '"Maddison Foo Koch 👻" <ebolynskii@mail.ru>', // sender address
//         to: "gamebadi@mail.ru", // list of receivers
//         subject: "Hello ✔", // Subject lineЫ
//         text: "Hello world?", // plain text body
//         html: "<b>Hello world?</b>", // html body
//     });

//     console.log("Message sent: %s", info.messageId);
//     // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }

const success = message => {
    transporter.sendMail(message, (err, info) => {

        if (err) return console.log(err);
        console.log('emailInfo:', info);


    })

}


module.exports = success

// main().catch(console.error);