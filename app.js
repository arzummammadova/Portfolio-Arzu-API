import express from 'express';
import 'dotenv/config';
import './src/db/ConnectDB.js'
import router from './src/routes/ProjectRouter.js'; 
import cors from 'cors';
import nodemailer from 'nodemailer';
import Joi from 'joi';

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

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' for Google Mail
    auth: {
        user: process.env.EMAIL_USER, // Your email address from .env
        pass: process.env.EMAIL_PASS, // Your app password from .env
    },
});
app.post('/api/contact', async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required().messages({
            "string.empty": "Name is required",
            "string.min": "Name should have at least 2 characters",
            "string.max": "Name should not exceed 50 characters"
        }),
        email: Joi.string().email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format"
        }),
        message: Joi.string().min(5).max(500).required().messages({
            "string.empty": "Message is required",
            "string.min": "Message should be at least 5 characters",
            "string.max": "Message should not exceed 500 characters"
        })
    });

    // Validate request body
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        // bütün errorları array şəklində göndərək
        return res.status(400).json({
            message: "Validation error",
            errors: error.details.map(err => err.message)
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
        console.log('Email sent successfully!');
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
});
app.get('/',(req,res)=>{
    res.send('hello world');
})



app.use('/api',router);


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT} `);
})