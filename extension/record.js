console.log("Focusnow.ai - record.js is running on this tab!");

// add listender for messages
chrome.runtime.onMessage.addListener(function (request, sender) {
    console.log("[CONTENT] - message received", request, sender);
  
    const { type, data } = request;
  
    switch (type) {
      case "initialized-configuration":
        console.log('hi it worked')
        break;
      default:
        break;
    }
  });
  