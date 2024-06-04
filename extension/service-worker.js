console.log("Focusnow.ai - service-worker.js is running on the background!");

let currentTabId = null;
let currentSessionId = null;

async function processScreenshot(command) {
  // capture screenshot on visible tab
  const dataUri = await chrome.tabs.captureVisibleTab();

  if (dataUri && currentSessionId) {
    fetch("http://localhost:3000/api/image", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        data: dataUri,
        currentSessionId
      }),
    }).catch((err) => console.error(err));
  }
}

chrome.tabs.onActivated.addListener(async function (activeInfo) {
  console.log("new tab", activeInfo);
  const { tabId } = activeInfo;
  currentTabId = tabId;

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  })

  const { url } = tab;
  const patternExtract = /\/app\/session\/(\w+)/;
  const match = url.match(patternExtract);

  if (match) {
    const extractedID = match[1]; // The captured group
    currentSessionId = extractedID;
  } else {
    console.log("No ID found in the string.");
  }
});

chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
  console.log("changedprops", changedProps);
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
