import express from 'express';
import users from './Data/users.js'
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from './Routes/UserRoute.js';
import PostRoute from './Routes/PostRoute.js';



dotenv.config();
const port = process.env.PORT || 3000;

connectDB();

const app = express();

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Routes

app.get('/', (req, res) => {
    res.send('API is running...')
})

app.get('/api/users', (req, res) => {
    res.json(users);
})

app.use('/api/auth', AuthRoute);
app.use('/api/user', UserRoute);
app.use('/api/post', PostRoute);

app.listen(port, ()=> console.log(`Server running at ${port}`))
