function audioBufferToWav(
  buffer: {
    numberOfChannels: any;
    sampleRate: any;
    getChannelData: (arg0: number) => any;
  },
  opt: { float32?: any } | undefined
) {
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

function encodeWAV(
  samples: string | any[],
  format: number,
  sampleRate: number,
  numChannels: number,
  bitDepth: number
) {
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

function interleave(inputL: string | any[], inputR: string | any[]) {
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

function writeFloat32(output: DataView, offset: number, input: string | any[]) {
  for (var i = 0; i < input.length; i++, offset += 4) {
    output.setFloat32(offset, input[i], true);
  }
}

function floatTo16BitPCM(
  output: DataView,
  offset: number,
  input: string | any[]
) {
  for (var i = 0; i < input.length; i++, offset += 2) {
    var s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

function writeString(view: DataView, offset: number, string: string) {
  for (var i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i] as number);
  }
  return btoa(binary);
}

export function saveAudio(chunks: any[], audioContext: any) {
  const length = chunks.reduce(
    (prev: any, cur: string | any[]) => prev + cur.length,
    0
  );
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

  if (outputBuffer.duration < 1) return null;

  // convert audiobuffer to wav
  const wav = audioBufferToWav(outputBuffer, {});
  const b64 = arrayBufferToBase64(wav);
  return b64;
  //   const blob = new window.Blob([new DataView(wav)], {
  //     type: "audio/wav",
  //   });
  //   const url = window.URL.createObjectURL(blob);

  //   const anchor = document.createElement("a");
  //   document.body.appendChild(anchor);
  //   anchor.href = url;
  //   anchor.download = "audio.wav";
  //   anchor.click();
  //   window.URL.revokeObjectURL(url);
  //   document.body.removeChild(anchor);
}
