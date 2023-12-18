

const urlParams = new URLSearchParams(location.search);

let roomId = urlParams.get("id");

if (!roomId) {
  roomId = Math.floor(Math.random() * 10000 + 10000);
  postMessage({ type: 'roomId', value: roomId });
}

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

onmessage = function (e) {
  if (e.data.type === 'input') {
    console.log(e.data.value);
    postMessage({ type: 'input', value: e.data.value });
  }
};
