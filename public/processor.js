// https://developer.chrome.com/blog/audio-worklet

class WorkletProcessor extends AudioWorkletProcessor {
  static BUFFER_SIZE = 4096;
  static SAMPLE_RATE = 44100; // Change this to your desired sample rate
  static CHUNK_DURATION = 10; // Duration of each audio chunk in seconds

  constructor() {
    super();
    this.buffer = new Float32Array(WorkletProcessor.BUFFER_SIZE);
    this.byteWritten = 0;

    // Parameters for VAD
    this.energyThreshold = 0.0000000005; // Adjust this threshold according to your needs
  }

  // # credit1: https://www.reddit.com/r/learnjavascript/comments/1buqjr3/solution_web_audio_replacing/
  // # credit2: https://dev.to/louisgv/quick-guide-to-audioworklet-30df
  // https://stackoverflow.com/questions/56592566/how-to-record-audio-using-audioworklet-and-audioworkletprocessor-in-javascript
  // https://stackoverflow.com/questions/25775704/html5-audio-api-inputbuffer-getchanneldata-to-audio-array-buffer
  // https://stackoverflow.com/questions/61264581/how-to-convert-audio-buffer-to-mp3-in-javascript
  process(inputs, _outputs, _parameters) {
    const input = inputs[0][0]; // first channel of first input

    const isVoiceActive = this.detectVoiceActivity(input);

    if (isVoiceActive) {
      this.append(input);
    } else {
      if (this.byteWritten > 0 && !this.speechDetected) {
        this.flush()
      }
    }

    return true;
  }

  detectVoiceActivity(data) {
    let energySum = 0;

    // Calculate energy of the audio frame
    for (let i = 0; i < data.length; i++) {
      energySum += data[i] * data[i];
    }
    const energy = energySum / data.length;
    // console.log('energy', energy);

    // Check if the energy exceeds the threshold
    if (energy > this.energyThreshold) {
      this.speechDetected = true;
      return true;
    }

    this.speechDetected = false;
    return false;
  }

  append(data) {
    if (this.isBufferFull()) this.flush();

    if (!data) return;

    for (let i = 0; i < data.length; i++) {
      this.buffer[this.byteWritten++] = data[i];
    }
  }

  initBuffer() {
    this.byteWritten = 0;
  }

  isBufferEmpty() {
    return this.byteWritten == 0;
  }

  isBufferFull() {
    return this.byteWritten == WorkletProcessor.BUFFER_SIZE;
  }

  /**
   * Sends the buffer's content to the main thread via postMessage(), and reset
   * the offset to 0
   */
  flush() {
    this.port.postMessage({
      buffer:
        this.byteWritten < this.buffer
          ? this.buffer.slice(0, this.byteWritten)
          : this.buffer,
      speechDetected: this.speechDetected,
    });
    this.initBuffer();
  }
}

registerProcessor("worklet-processor", WorkletProcessor);
