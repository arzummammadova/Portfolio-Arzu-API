import express from 'express';
import 'dotenv/config';
import './src/db/ConnectDB.js'
import router from './src/routes/ProjectRouter.js'; 
import cors from 'cors';
import nodemailer from 'nodemailer';
import Joi from 'joi';
import rateLimit from 'express-rate-limit';

const app=express();

const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  'http://localhost:3000',
  'https://portfolio-arzu-zeru.vercel.app',
 'https://arzumammadova.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // əgər cookie/token göndərirsənsə
}));

app.use(express.json());
const contactLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 dəqiqə
  max: 2,
  message: { message: "Too many requests from this IP, please try again later." }
});

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' for Google Mail
    auth: {
        user: process.env.EMAIL_USER, // Your email address from .env
        pass: process.env.EMAIL_PASS, // Your app password from .env
    },
});
app.post('/api/contact', contactLimiter, async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        message: Joi.string().min(3).max(500).required()
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        // Daha oxunaqlı format
        const formattedErrors = {};
        error.details.forEach(err => {
            const field = err.path[0]; // name, email, message
            formattedErrors[field] = err.message;
        });

        return res.status(400).json({
            message: "Validation error",
            errors: formattedErrors
        });
    }

    const { name, email, message } = value;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New Contact Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong> ${message}</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

app.get('/',(req,res)=>{
    res.send('hello world');
})



app.use('/api',router);


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT} `);
})