import express from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import { createNodeRedisClient, WrappedNodeRedisClient } from 'handy-redis';
import requiredEnv from './requiredEnv.json' assert {
    type: "json"
};
import init_routes from './router.js';
import defaultAdmin from './controllers/auth/defineAdmin.js';

dotenv.config();

const app = express();

const port: number = parseInt(process.env.API_PORT!) || 80;
const host: string = process.env.API_HOST || '0.0.0.0';
const proxyLevel: number = parseInt(process.env.PROXY_LEVEL!) || 0;

let redisClient: WrappedNodeRedisClient;

function check_env_vars(): boolean {
    for (let i = 0; i < requiredEnv.length; i++) {
      if (!process.env[requiredEnv[i]]) {
        return false;
      }
    }
    return true;
};

async function start(): Promise<void> {
    if (!check_env_vars()) {
        console.error('Missing required environment variables');
        return;
    }
    console.log("AquaSensor API");
    console.log('Starting server');
    app.disable('x-powered-by');
    app.set("trust proxy", proxyLevel);
    app.get("/ip", (request, response) => response.send(request.ip));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    try {
        console.log("Connecting to db");
        await mongoose.connect(process.env.MONGODB_URI!);
    } catch (error) {
        console.error("Cannot connect to db");
        console.error(error);
        return;
    }
    try {
        console.log("Connecting to redis");
        redisClient = createNodeRedisClient({ host: process.env.REDIS_HOST! });
    } catch (error) {
        console.error("Cannot connect to redis");
        console.error(error);
    }
    try {
        console.log("Connecting to Arduino");
        if (process.env.NODE_ENV !== 'dev') {
            console.log("Arduino connection delayed to background");
        }
        else
            console.log("Arduino connection skipped");
    } catch (error) {
        console.error("Cannot connect to Arduino");
        console.error(error);
        return;
    }
    await init_routes(app);
    await defaultAdmin();
    app.listen(port, host, async () => {
        console.log(`Server is running on http://${host}:${port}`);
    });
}

if (process.env.NODE_ENV !== 'test')
    start();

process.on("uncaughtException", (err) => {
    console.log("Caught exception: ", err);
});

export { redisClient, app, start };