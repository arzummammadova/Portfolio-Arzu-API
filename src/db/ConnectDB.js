import mongoose, { connect } from 'mongoose';


const mongoURI=process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
try {
    mongoose.connect(mongoURI);
    console.log("connect to mongodb successfully");
} catch (error) {
    console.error('Error connecting to MongoDB:', error);
    
}