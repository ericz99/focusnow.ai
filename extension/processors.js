// https://developer.chrome.com/blog/audio-worklet

class WorkletProcessor extends AudioWorkletProcessor {
  static BUFFER_SIZE = 8192;
  static SAMPLE_RATE = 44100; // Change this to your desired sample rate
  static CHUNK_DURATION = 10; // Duration of each audio chunk in seconds

  constructor() {
    super();
    this.buffer = new Int16Array(WorkletProcessor.BUFFER_SIZE);
    this.offset = 0;
    this.sampleCount = 0;
  }

  // # credit1: https://www.reddit.com/r/learnjavascript/comments/1buqjr3/solution_web_audio_replacing/
  // # credit2: https://dev.to/louisgv/quick-guide-to-audioworklet-30df
  process(inputs, _outputs, _parameters) {
    // Assumes the input is mono (1 channel). If there are more channels, they
    // are ignored
    const input = inputs[0][0]; // first channel of first input

    // convert input channel and feed it into buffer of int16array
    for (let i = 0; i < input.length; i++) {
      const sample = Math.max(-1, Math.min(1, input[i]));
      this.buffer[i + this.offset] =
        sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    }

    this.offset += input.length;
    this.sampleCount += input.length;

    // Once the buffer is filled entirely, flush the buffer
    if (this.sampleCount >= WorkletProcessor.SAMPLE_RATE * WorkletProcessor.CHUNK_DURATION) {
      this.flush();
      this.sampleCount = 0;
    }

    return true;
  }

  /**
   * Sends the buffer's content to the main thread via postMessage(), and reset
   * the offset to 0
   */
  flush() {
    this.port.postMessage({
        buffer: this.buffer,
        offset: this.offset
    });
    
    this.offset = 0;
  }
}

registerProcessor("worklet-processor", WorkletProcessor);
