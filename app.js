import express from 'express';
import 'dotenv/config';
import './src/db/ConnectDB.js'
import router from './src/routes/ProjectRouter.js'; 
import cors from 'cors';
import nodemailer from 'nodemailer';

const app=express();

const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  'http://localhost:3000',
  'https://portfolio-arzu-zeru.vercel.app'
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
app.post('/api/contact', async (req, res) => { // Make the function async
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Email content
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: process.env.EMAIL_USER,   // Recipient address (you can change this to another email if you prefer)
        subject: `New Contact Message from ${name}`, // Subject line
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // Plain text body
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong> ${message}</p>`, // HTML body
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        // Provide a more user-friendly error message
        res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
});

app.get('/',(req,res)=>{
    res.send('hello world');
})


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT} `);
})

app.use('/api',router);
