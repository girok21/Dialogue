import express from 'express';
import users from './data/users.js';
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

app.get('/', (req, res) => {
    res.send('API is running...')
})

app.get('/api/users', (req, res) => {
    res.json(users);
})

app.listen(port, ()=> console.log(`Server running at ${port}`))
