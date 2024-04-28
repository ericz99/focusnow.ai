const newSessionBtn = document.querySelector("#new-session");
const endSessionBtn = document.querySelector("#end-session");
const soundClips = document.querySelector("#sound-clips");

// # https://github.com/GoogleChrome/chrome-extensions-samples/issues/627
//  https://developer.chrome.com/docs/extensions/reference/api/tabCapture#method-capture
// https://developer.chrome.com/docs/extensions/mv2/reference/tabCapture#preserving-system-audio

function audioBufferToWav(buffer, opt) {
  opt = opt || {};

  var numChannels = buffer.numberOfChannels;
  var sampleRate = buffer.sampleRate;
  var format = opt.float32 ? 3 : 1;
  var bitDepth = format === 3 ? 32 : 16;

  var result;
  if (numChannels === 2) {
    result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
  } else {
    result = buffer.getChannelData(0);
  }

  return encodeWAV(result, format, sampleRate, numChannels, bitDepth);
}

function encodeWAV(samples, format, sampleRate, numChannels, bitDepth) {
  var bytesPerSample = bitDepth / 8;
  var blockAlign = numChannels * bytesPerSample;

  var buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  var view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, "RIFF");
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  /* RIFF type */
  writeString(view, 8, "WAVE");
  /* format chunk identifier */
  writeString(view, 12, "fmt ");
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, blockAlign, true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(view, 36, "data");
  /* data chunk length */
  view.setUint32(40, samples.length * bytesPerSample, true);
  if (format === 1) {
    // Raw PCM
    floatTo16BitPCM(view, 44, samples);
  } else {
    writeFloat32(view, 44, samples);
  }

  return buffer;
}

function interleave(inputL, inputR) {
  var length = inputL.length + inputR.length;
  var result = new Float32Array(length);

  var index = 0;
  var inputIndex = 0;

  while (index < length) {
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}

function writeFloat32(output, offset, input) {
  for (var i = 0; i < input.length; i++, offset += 4) {
    output.setFloat32(offset, input[i], true);
  }
}

function floatTo16BitPCM(output, offset, input) {
  for (var i = 0; i < input.length; i++, offset += 2) {
    var s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

function writeString(view, offset, string) {
  for (var i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function saveAudio(chunks, audioContext) {
  const length = chunks.reduce((prev, cur) => prev + cur.length, 0);
  const outputBuffer = audioContext.createBuffer(1, length, 44100);
  const outputData = outputBuffer.getChannelData(0);

  let offset = 0;
  for (let i = 0; i < chunks.length; i++) {
    const inputData = chunks[i];
    for (let j = 0; j < inputData.length; j++) {
      outputData[offset] = inputData[j];
      offset++;
    }
  }

  console.log("output buffer data ", outputBuffer);

  // convert audiobuffer to wav
  const wav = audioBufferToWav(outputBuffer);
  const blob = new window.Blob([new DataView(wav)], {
    type: "audio/wav",
  });
  const url = window.URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  document.body.appendChild(anchor);
  anchor.style = "display: none";
  anchor.href = url;
  anchor.download = "audio.wav";
  anchor.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(anchor);
}

let audioContext = null;
let audioSource = null;
let intv = null;

newSessionBtn.onclick = () => {
  audioContext = new AudioContext({
    sampleRate: 44100,
  });

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

        audioSource = audioContext.createMediaStreamSource(stream);
        let chunks = [];

        audioContext.audioWorklet.addModule("processors.js").then(() => {
          const node = new AudioWorkletNode(
            audioContext,
            "worklet-processor"
          );
          audioSource.connect(node).connect(audioContext.destination);
          node.port.onmessage = (e) => {
            const inputData = e.data;
            const buffer = new Float32Array(inputData);
            console.log("incoming buffer -> ", buffer);
            chunks.push(buffer);
          };

          intv = setInterval(() => {
            console.log('disconnected done!')
            saveAudio(chunks, audioContext);
            chunks = [];
          }, 15000);
        });

        // /** THIS ONE IS DEPRECATED CODE - DO NO USE - */
        // // ### https://blog.yaox023.com/an-audio-recorder-using-scriptprocessornode
        // const recorder = audioContext.createScriptProcessor(4096, 1, 1);
        // recorder.onaudioprocess = (event) => {
        //   const inputData = event.inputBuffer.getChannelData(0);
        //   const buffer = new Float32Array(inputData);
        //   chunks.push(buffer);
        //   console.log("audio--->", buffer);
        // };

        // mediaStream.connect(recorder);
        // recorder.connect(audioContext.destination);

        // setTimeout(() => {
        //   recorder.disconnect();
        //   console.log("disconneceted!");

        //   saveAudio(chunks, audioContext);
        // }, 10000);
      })
      .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`);
      });
  });
};

endSessionBtn.onclick = () => {
  if (!audioContext || !audioSource) return;
  audioSource.disconnect();
  audioContext = null;
  audioSource = null;
  clearInterval(intv);
  console.log('Disconnecting audio source!')
};