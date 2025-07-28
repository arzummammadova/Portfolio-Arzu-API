import express from 'express';
import 'dotenv/config';
import './src/db/ConnectDB.js'
import router from './src/routes/ProjectRouter.js'; 
import cors from 'cors';

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

app.get('/',(req,res)=>{
    res.send('hello world');
})


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT} `);
})

app.use('/api',router);
