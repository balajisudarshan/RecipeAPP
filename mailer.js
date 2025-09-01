const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

async function sendEmail(to,subject,text,html){
    try {
        const info  = await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to,
            subject,
            text,
            html
        })

        console.log("Email sent: "+info.response);
        return info;    
    } catch (error) {
        console.error("Error sending email: ",error);
        throw error;
    }
}

function generateOtp(){
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtp(email,otp){
    // const otp = generateOtp();
    await sendEmail(
        email,
        "Your OTP Code",
        `Your OTP code is ${otp}`,
        `<h2>Hello, you have requested an OTP</h2><p>Your OTP code is <b>${otp}</b></p>`
    )
    return otp;
}

function generateTemplate(title, body, footer = "") {
  return `
    <div style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
      <div style="max-width:600px; margin:auto; background:white; border-radius:10px; padding:20px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color:#333; text-align:center;">${title}</h2>
        <div style="font-size:16px; color:#555; line-height:1.6;">${body}</div>
        ${footer ? `<hr><p style="font-size:12px; color:#888; text-align:center;">${footer}</p>` : ""}
      </div>
    </div>
  `;
}
async function sendMessage(email,subject,message){
    await sendEmail(
        email,
        subject,
        message,
        `<p>${message}</p>`
    )
}

module.exports = {sendEmail,sendOtp,sendMessage,generateOtp,generateTemplate};