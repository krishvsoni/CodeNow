export function createWebSocket(code: unknown) {
    const socket = new WebSocket(`ws://localhost:3000/api/ws/${code}`);
  
    socket.onopen = () => {
      console.log("WebSocket connection opened.");
      socket.send(JSON.stringify({ message: "Hello from client", code }));
    };
  
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message from server:", data);
    };
  
    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };
  
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    return socket;
  }
  