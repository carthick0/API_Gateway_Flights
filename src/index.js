const express = require('express');
const rateLimit = require('express-rate-limit');
const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minute
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use(limiter);


app.use('/flightsService', createProxyMiddleware({
    target: ServerConfig.FLIGHT_SERVICE,
    changeOrigin: true,
}));


app.use('/bookingsService', createProxyMiddleware({
    target: ServerConfig.BOOKING_SERVICE,
    changeOrigin: true
}));


app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});