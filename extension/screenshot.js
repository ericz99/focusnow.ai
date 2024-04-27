console.log("Focusnow.ai - screenshot.js is running on this tab!");

function downloadScreenshot(dataUri) {
  const link = document.createElement("a");
  link.href = dataUri;
  link.download = "sample";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  console.log('Downloaded!')
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
