import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage, ServerResponse } from "http";
import { Socket } from "net";

let connections: WebSocket[] = [];

export default function handler(req: IncomingMessage, res: ServerResponse & { socket: { server: {
    on(arg0: string, arg1: (request: IncomingMessage, socket: Socket, head: Buffer) => void): unknown; wss?: WebSocketServer 
} } }) {
  if (res.socket.server.wss) {
    console.log("WebSocket server already running.");
  } else {
    console.log("Starting WebSocket server...");
    const wss = new WebSocketServer({ noServer: true });

    res.socket.server.on("upgrade", (request: IncomingMessage, socket: Socket, head: Buffer) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }); 

    res.socket.server.wss = wss;

    wss.on("connection", (ws) => {
      console.log("Client connected.");

      ws.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());
        console.log("Received:", parsedMessage);

        // Broadcast the message to all connected clients
        connections.forEach((conn) => conn.send(message.toString()));
      });

      ws.on("close", () => {
        console.log("Client disconnected.");
        connections = connections.filter((conn) => conn !== ws);
      });

      connections.push(ws);
    });
  }

  res.end();
}