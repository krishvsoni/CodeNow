// Main thread script (main.js)

const urlParams = new URLSearchParams(location.search);

let roomId = urlParams.get("id");

if (!roomId) {
  roomId = Math.floor(Math.random() * 10000 + 10000);
  window.location.search = `id=${roomId}`;
}

const textArea = document.querySelector("textarea");

const wsurl = `wss://s11278.blr1.piesocket.com/v3/${roomId}?api_key=S3GvNW3jI1nwzmx2n6jI4KypXkEbcwsG9DFTBOnL&notify_self=1`;

const socket = new WebSocket(wsurl);

socket.onopen = () => {};

socket.onmessage = (e) => {
  // You can handle audio logic here if needed
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
