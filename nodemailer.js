const nodemailer = require ("nodemailer")

async function main(){
    let testAccount = await nodemailer.createTestAccount();


let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 567,
    secure: false,
    auth:{
        user: testAccount.user,
        pass: testAccount.pass
    },
});

let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to: "bar@example.com",
    subject: "Hello",
    text: "Hello World?",
    html: "<b> Hello world </b>"
});

console.log("Message sent: %s", info.messageId);

console.log("Preview URL: %s",nodemailer.getTestMessageUrl(info));
}

main().catch(console.error)