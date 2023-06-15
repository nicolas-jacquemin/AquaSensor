import { Server } from "socket.io";
import { server } from "../app.js";

const io = new Server(server);

export default (req: any, res: any, next: any) => {
    req.io = io;
    next();
}
