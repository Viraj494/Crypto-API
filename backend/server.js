const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const authRouter = require( './routes/authRoute.js' );
const favRouter = require( './routes/currencyRoutes' )

const app = express();

//MIDDLEWARES
app.use(cors())
app.use(express.json());

//ROUTE
app.use('/api/auth', authRouter)
app.use('/fav', favRouter)

//MONGODB CONNECTION
const URI = process.env.DB_URL;

mongoose
    .connect(URI)
    .then(() => console.log('Connected to MongoDB!'))
    .catch((error) => console.error('Failed to connect to MongoDB: ', error));

//GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

//SERVER
const PORT = 8000;
app.listen(PORT, () => {
    console.log( `Server running on port ${PORT}`);
})
