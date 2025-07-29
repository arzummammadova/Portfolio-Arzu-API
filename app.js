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
app.post('/api/contact', async (req, res) => {
    // Destructure form data from the request body
    const { name, email, message } = req.body;

    // Server-side validation: Check if all required fields are present.
    // This provides a final layer of validation beyond client-side checks.
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields (name, email, message) are required.' });
    }

    // Define the email content and recipient details.
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender's email address (your email)
        to: process.env.EMAIL_USER,   // Recipient's email address (the email where you want to receive messages)
                                      // You can change this to a different email if desired.
        subject: `New Contact Message from ${name}`, // Subject line for the email
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // Plain text version of the email body
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong> ${message}</p>`, // HTML version of the email body (for rich text)
    };

    try {
        // Attempt to send the email using the configured transporter.
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!'); // Log success to the console
        // Send a success response back to the frontend
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        // If an error occurs during email sending (e.g., incorrect credentials, network issues)
        console.error('Error sending email:', error); // Log the detailed error
        // Send an error response back to the frontend
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
