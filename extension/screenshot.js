console.log("Focusnow.ai - screenshot.js is running on this tab!");

function downloadScreenshot(dataUri) {
  console.log('datauri', dataUri)

  fetch('http://localhost:3000/api/image', {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin":"*"
    },
    body: JSON.stringify({
      data: dataUri
    })
  }).catch((err) => console.error(err))
}

// add listender for messages
chrome.runtime.onMessage.addListener(function (request, sender) {
  console.log("[CONTENT] - message received", request, sender);

  const { type, data } = request;

  switch (type) {
    case "send-screenshot-to-ai":
      downloadScreenshot(data);
      break;
    default:
      break;
  }
});
