const urlParams = new URLSearchParams(location.search);
let roomId = urlParams.get("id");

if (!roomId) {
  roomId = Math.floor(Math.random() * 10000 + 10000);
  window.location.search = `id=${roomId}`;
}

const textArea = document.querySelector("textarea");

const wsurl = `wss://s11278.blr1.piesocket.com/v3/${roomId}?api_key=S3GvNW3jI1nwzmx2n6jI4KypXkEbcwsG9DFTBOnL&notify_self=1`;

const socket = new WebSocket(wsurl);

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

const broadcastChannel = new BroadcastChannel(`room_${roomId}`);

const ae = new Audio();

socket.onopen = () => {};

socket.onmessage = (e) => {
  ae.play();
  textArea.value = e.data;
  broadcastChannel.postMessage({ type: 'codeChange', code: e.data });
};

textArea.addEventListener("input", debounce((e) => {
  console.log(e.target.value);
  socket.send(e.target.value);
}));

const checkbox = document.getElementById("checkbox");
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

broadcastChannel.onmessage = (event) => {
  if (event.data.type === 'codeChange') {
    textArea.value = event.data.code;
  }
};

function updateLineNumbers() {
  const codeInput = document.getElementById("codeInput");
  const lineNumbers = document.getElementById("lineNumbers");
  const lines = codeInput.value.split("\n");
  const lineCount = lines.length;

  const lineNumbersContent = Array.from({ length: lineCount }, (_, i) => i + 1).join("\n");
  lineNumbers.textContent = lineNumbersContent;
  lineNumbers.scrollTop = codeInput.scrollTop;
}

updateLineNumbers();

const typingElement = document.getElementById('typing-text');
const textToType = typingElement.innerText;
typingElement.innerText = '';

function typeText(index) {
  typingElement.innerHTML += textToType.charAt(index);
  index++;

  if (index < textToType.length) {
    setTimeout(() => typeText(index), 100);
  }
}

window.onload = function () {
  typeText(0);
};



