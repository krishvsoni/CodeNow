// Main thread script (main.js)

const urlParams = new URLSearchParams(location.search);

let roomId = urlParams.get("id");

if (!roomId) {
  roomId = Math.floor(Math.random() * 10000 + 10000);
  window.location.search = `id=${roomId}`;
}

const textArea = document.querySelector("textarea");

// Load WebSocket URL from the file
fetch('/websocket_url.txt')
  .then(response => response.text())
  .then(websocketUrl => {
    const socket = new WebSocket(websocketUrl);

    socket.onopen = () => {};

    socket.onmessage = (e) => {
      textArea.value = e.data;
    };

    textArea.addEventListener(
      "input",
      debounce((e) => {
        console.log(e.target.value);
        socket.send(e.target.value);
      })
      
    );

    const checkbox = document.getElementById("checkbox");
    checkbox.addEventListener("change", () => {
      document.body.classList.toggle("dark");
    });
  })
  .catch(error => console.error('Error loading WebSocket URL:', error));
