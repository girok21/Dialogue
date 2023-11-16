import express from 'express';
import path from 'path';
import users from './Data/users.js'
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from './Routes/UserRoute.js';
import PostRoute from './Routes/PostRoute.js';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary'; 


dotenv.config();
const port = process.env.PORT || 3000;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

connectDB();
const __dirname = path.resolve(); // Set __dirname to current working directory
const app = express();

//Body parser middleware
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true }));

//cookie parser middleware
app.use(cookieParser());

//Routes

app.use('/api/auth', AuthRoute);
app.use('/api/user', UserRoute);
app.use('/api/post', PostRoute);

if( process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    //any route that is not api will be redirected to index.html
    app.get('*', (req, res) => {
        const indexPath = path.resolve(__dirname, 'frontend', 'dist', 'index.html');
        console.log(`Serving ${indexPath} for route: ${req.url}`);
        res.sendFile(indexPath);
    })
}else{
    app.get('/', (req, res) => {
        res.send('API is running...')
    })
}

app.listen(port, ()=> console.log(`Server running at ${port}`))
