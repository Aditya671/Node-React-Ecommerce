import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoSantitze from 'express-mongo-sanitize';
import "express-async-errors";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import xss from 'xss-clean';
import helmet from 'helmet';
import rateLimit from "express-rate-limit";
import session from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import morgan from 'morgan';
import { applicationPath } from './src/utils/applicationPath.js';

// Import Code Files
import { errorHandler } from "./src/handlers/index.js";
import appRoutes from './src/routers/index.js';
import { mongoDbConnect } from './src/middleware/mongoConnect.js';


// Configurations
const MongoDBStore = connectMongoDBSession(session);
const app = express();
const store = new MongoDBStore({
   uri: process.env.MONGO_URL,
   collection: 'session'
})

dotenv.config({path:applicationPath(".env")});
const corsOptions = {
   origin: "http://localhost:3000",
   optionsSuccessStatus: 200,
   method: ['GET', 'POST', 'PATCH', 'DELETE', 'UPDATE']
}
const port = process.env.PORT || 8000;
const rateLimiter = rateLimit({
   windowMs: 15 * 60 * 100,
   max: 100,
   standardHeaders: true,
   legacyHeaders: false,
   message: "Too Many Requests from this Ip address, Try again after 15 minutes"
});

// Server Configurations

// app.use(express.static(applicationPath("./client/public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(xss());
app.use(helmet());
app.use(rateLimiter);
app.use(mongoSantitze());
app.use(cors(corsOptions));
app.use(express.json());
app.use(session({
   secret: process.env.REFRESH_SECRET_CIPHER,
   resave: false,
   saveUninitialized: false,
   store: store,
   cookie: { maxAge: process.env.REFRESH_JWT_LIFETIME }
}
));
app.use(morgan(process.env.NODE_ENV_DEV))
// Main Application Start Here
app.use('/api/welcome',async (req, res, next) => {
   res.send("Hello!! Welcome to the Ecommerce App")
   next()
})
app.use('/api',appRoutes)

// Handle Server
const start = async () => {
   try {
      await mongoDbConnect(process.env.MONGO_URL);
      app.listen(port, () => console.log("server listen"));
      console.log('\n----- mongoDb Connection Established ->\n')
   }
   catch (err) {
      console.log(err)
   }
}
app.use(errorHandler)
start();
