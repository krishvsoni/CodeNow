// Get or generate a room ID from the URL parameters
const urlParams = new URLSearchParams(location.search);
let roomId = urlParams.get("id");

if (!roomId) {
  // Generate a random room ID if not present in the URL
  roomId = Math.floor(Math.random() * 10000 + 10000);
  // Update the URL with the generated room ID
  window.location.search = `id=${roomId}`;
}

// Select the textarea element
const textArea = document.querySelector("textarea");

// WebSocket URL for communication
const wsurl = `wss://s11278.blr1.piesocket.com/v3/${roomId}?api_key=S3GvNW3jI1nwzmx2n6jI4KypXkEbcwsG9DFTBOnL&notify_self=1`;

// Create a WebSocket connection
const socket = new WebSocket(wsurl);

// Debounce function for handling textarea input
const debounce = (func, timer = 250) => {
  let timeId = null;
  return (...args) => {
    if (timeId) {
      clearTimeout(timeId);
    }
    timeId = setTimeout(() => {
      func(...args);
    }, timer);
  };
};

// Create a Broadcast Channel with the room ID for inter-tab communication
const broadcastChannel = new BroadcastChannel(`room_${roomId}`);

// Audio element for playing a sound on message receive
const ae = new Audio();

// WebSocket event handler when the connection is opened
socket.onopen = () => {};

// WebSocket event handler when a message is received
socket.onmessage = (e) => {
  // Play a sound and update the textarea with the received code
  ae.play();
  textArea.value = e.data;

  // Broadcast the code change to all connected clients
  broadcastChannel.postMessage({ type: 'codeChange', code: e.data });
};

// Event listener for textarea input with debouncing
textArea.addEventListener(
  "input",
  debounce((e) => {
    // Log the input value and send it via WebSocket
    console.log(e.target.value);
    socket.send(e.target.value);
  })
);

// Event listener for checkbox change (toggle dark mode)
const checkbox = document.getElementById("checkbox");
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

// Event listener for messages from other tabs via Broadcast Channel
broadcastChannel.onmessage = (event) => {
  if (event.data.type === 'codeChange') {
    // Update the textarea with the received code from other tabs
    textArea.value = event.data.code;
  }
};
