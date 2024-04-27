const newSessionBtn = document.querySelector("#new-session");
const endSessionBtn = document.querySelector("#end-session");
const soundClips = document.querySelector("#sound-clips");

// # https://github.com/GoogleChrome/chrome-extensions-samples/issues/627
//  https://developer.chrome.com/docs/extensions/reference/api/tabCapture#method-capture
// https://developer.chrome.com/docs/extensions/mv2/reference/tabCapture#preserving-system-audio

function createWavData(int16Array, sampleRate = 44100) {
  const dataSize = int16Array.length * 2;
  const header = new Uint8Array(44);

  header.set(
    new Uint8Array([
      82,
      73,
      70,
      70,
      (dataSize + 36) & 0xff,
      ((dataSize + 36) >> 8) & 0xff,
      ((dataSize + 36) >> 16) & 0xff,
      ((dataSize + 36) >> 24) & 0xff,
      87,
      65,
      86,
      69,
      102,
      109,
      116,
      32,
      16,
      0,
      0,
      0,
      1,
      0,
      1,
      0,
      (sampleRate >> 0) & 0xff,
      (sampleRate >> 8) & 0xff,
      (sampleRate >> 16) & 0xff,
      (sampleRate >> 24) & 0xff,
      (sampleRate * 2) & 0xff,
      ((sampleRate * 2) >> 8) & 0xff,
      2,
      0,
      16,
      0,
      100,
      97,
      116,
      97,
      dataSize & 0xff,
      (dataSize >> 8) & 0xff,
      (dataSize >> 16) & 0xff,
      (dataSize >> 24) & 0xff,
    ])
  );

  const wavData = new Uint8Array(header.length + int16Array.length * 2);
  wavData.set(header);
  for (let i = 0; i < int16Array.length; i++) {
    const offset = header.length + i * 2;
    const value = int16Array[i];
    wavData[offset] = value & 0xff;
    wavData[offset + 1] = (value >> 8) & 0xff;
  }

  return wavData;
}

function download(buffer, offset) {
  // Convert collected samples to WAV data
  const sampleRate = 44100;
  const wavData = createWavData(
    buffer.subarray(0, offset),
    sampleRate
  );

  console.log("wavdata", wavData);

  // Create a Blob from the WAV data
  const blob = new Blob([wavData], { type: "audio/wav" });

  // Create a download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `audio_${Date.now()}.wav`; // Add timestamp to filename

  // Simulate a click on the link to trigger the download
  link.click();

  // Clean up
  URL.revokeObjectURL(url);
}

class ProcessorWorkletNode extends AudioWorkletNode {
  constructor(context) {
    super(context, "worklet-processor");
  }
}

newSessionBtn.onclick = () => {
  const audioContext = new AudioContext();

  // Get the streamId from desktopCapture
  chrome.desktopCapture.chooseDesktopMedia(["tab", "audio"], (streamId) => {
    console.log("streamid", streamId);

    // Get the stream
    navigator.mediaDevices
      .getUserMedia({
        video: {
          mandatory: {
            chromeMediaSource: "screen",
            chromeMediaSourceId: streamId,
          },
        },
        audio: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: streamId,
          },
        },
      })
      .then((stream) => {
        stream.removeTrack(stream.getVideoTracks()[0]);
        console.log("stream--->", stream);

        const mediaStream = audioContext.createMediaStreamSource(stream);

        audioContext.audioWorklet.addModule("processors.js").then(() => {
          let node = new ProcessorWorkletNode(audioContext);
          mediaStream.connect(node);
          node.connect(audioContext.destination);

          node.port.onmessage = (e) => {
            const { buffer, offset } = e.data;
            console.log("data incoming -> ", buffer);
            console.log('offset', offset);
            download(buffer, offset);
          };

          // AudioWorkletNode can be interoperable with other native AudioNodes.
          //   oscillator.connect(node).connect(audioContext.destination);
          //   oscillator.start();
          // mediaStream.connect(node);
          // node.connect(audioContext.destination);
        });

        // const recorder = audioContext.createScriptProcessor(0, 1, 1);
        // recorder.onaudioprocess = (event) => {
        //   const inputData = event.inputBuffer.getChannelData(0);
        //   console.log("audio--->", inputData);
        // };

        // mediaStream.connect(recorder);
        // recorder.connect(audioContext.destination);

        // setTimeout(() => {
        //     recorder.disconnect();
        //     console.log('disconneceted!')
        // }, 5000)
      })
      .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`);
      });

    // we need to get the target tab id that was selected
    //   chrome.tabs.sendMessage(tabId, {
    //     type: "initialized-configuration",
    //     data: {
    //       streamId,
    //     },
    //   });
  });
};

// endSessionBtn.disabled = true;

// if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//   console.log("getUserMedia supported.");

//   let chunks = [];
//   let constraints = { audio: true };

//   navigator.mediaDevices
//     .getUserMedia(constraints)

//     // Success callback
//     .then((stream) => {
//       const audioStream = new MediaStream([...stream.getTracks()]);
//       const mediaRecorder = new MediaRecorder(audioStream);

//       newSessionBtn.onclick = function () {
//         mediaRecorder.start();
//         console.log(mediaRecorder.state);
//         console.log("Recorder started.");
//         newSessionBtn.style.background = "red";

//         endSessionBtn.disabled = false;
//         newSessionBtn.disabled = true;
//       };

//       endSessionBtn.onclick = function () {
//         mediaRecorder.stop();
//         console.log(mediaRecorder.state);
//         console.log("Recorder stopped.");
//         endSessionBtn.style.background = "";
//         endSessionBtn.style.color = "";

//         endSessionBtn.disabled = true;
//         newSessionBtn.disabled = false;
//       };

//       mediaRecorder.onstop = function (e) {
//         console.log("Last data to read (after MediaRecorder.stop() called).");

//         const clipContainer = document.createElement("article");
//         const clipLabel = document.createElement("p");
//         const audio = document.createElement("audio");

//         clipContainer.classList.add("clip");
//         audio.setAttribute("controls", "");

//         clipContainer.appendChild(audio);
//         clipContainer.appendChild(clipLabel);
//         soundClips.appendChild(clipContainer);

//         audio.controls = true;
//         const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
//         chunks = [];
//         const audioURL = window.URL.createObjectURL(blob);
//         audio.src = audioURL;
//         console.log("recorder stopped");

//         console.log(audio);
//       };

//       mediaRecorder.ondataavailable = (e) => {
//         console.log("data", e.data);
//         chunks.push(e.data);
//       };
//     })

//     // Error callback
// .catch((err) => {
//   console.error(`The following getUserMedia error occurred: ${err}`);
// });
// } else {
//   console.log("getUserMedia not supported on your browser!");
// }
