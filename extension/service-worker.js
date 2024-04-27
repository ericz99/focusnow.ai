console.log("Focusnow.ai - service-worker.js is running on the background!");

let currentTabId = null;
let ws = null;

function connectWS() {
  ws = new WebSocket("wss://example.com/ws");

  webSocket.onopen = (event) => {
    console.log("websocket open");
    keepAlive();
  };

  webSocket.onmessage = (event) => {
    console.log(`websocket received message: ${event.data}`);
  };

  webSocket.onclose = (event) => {
    console.log("websocket connection closed");
    webSocket = null;
  };
}

function disconnectWS() {
  if (ws == null) return;
  ws.close();
}

function keepAlive() {
  const keepAliveIntervalId = setInterval(
    () => {
      if (ws) {
        ws.send("keepalive");
      } else {
        clearInterval(keepAliveIntervalId);
      }
    },
    // Set the interval to 20 seconds to prevent the service worker from becoming inactive.
    20 * 1000
  );
}

async function processScreenshot(command) {
  // capture screenshot on visible tab
  const dataUri = await chrome.tabs.captureVisibleTab();

  if (dataUri) {
    // send data to content tab
    chrome.tabs.sendMessage(currentTabId, { type: command, data: dataUri });
  }
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
  console.log('new tab', activeInfo);
  const { tabId } = activeInfo;
  currentTabId = tabId;
});

chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
  console.log('changedprops', changedProps);
  // We are waiting for the tab we opened to finish loading.
  if (changedProps.status != "complete") return;

  // Passing the above test means this is the event we were waiting for.
  // There is nothing we need to do for future onUpdated events, so we
  // use removeListner to stop getting called when onUpdated events fire.
  chrome.tabs.onUpdated.removeListener(listener);
  currentTabId = tabId;
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: "main.html",
  });
});

// listen for commands
chrome.commands.onCommand.addListener(async (command) => {
  console.log(`[COMMAND] - ${command} has been triggered!`);

  switch (command) {
    case "send-screenshot-to-ai":
      await processScreenshot(command);
      break;
    default:
      break;
  }
});

// add listender for messages
chrome.runtime.onMessage.addListener(function (request, sender) {
  console.log("[SERVICE_WORKER] - message received", request, sender);

  switch (request.type) {
    default:
      break;
  }
});
