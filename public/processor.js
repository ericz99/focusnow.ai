// https://developer.chrome.com/blog/audio-worklet

// 0.00001561176831382764 - this is  when im typing and clicking in front of the mic not speaking
// 0.0000000005
// 0.0014702180095889513 - talking
// 0.000003727135943205314 -- not takking

class Resampler {
  constructor(options) {
    this.options = options;
    this.inputBuffer = [];

    if (options.nativeSampleRate < 16000) {
      console.error(
        "nativeSampleRate is too low. Should have 16000 = targetSampleRate <= nativeSampleRate"
      );
    }
  }

  process(audioFrame) {
    const outputFrames = [];
    this.fillInputBuffer(audioFrame);

    while (this.hasEnoughDataForFrame()) {
      const outputFrame = this.generateOutputFrame();
      outputFrames.push(outputFrame);
    }

    return outputFrames;
  }

  async *stream(audioFrame) {
    this.fillInputBuffer(audioFrame);

    while (this.hasEnoughDataForFrame()) {
      const outputFrame = this.generateOutputFrame();
      yield outputFrame;
    }
  }

  fillInputBuffer(audioFrame) {
    for (const sample of audioFrame) {
      this.inputBuffer.push(sample);
    }
  }

  hasEnoughDataForFrame() {
    return (
      (this.inputBuffer.length * this.options.targetSampleRate) /
        this.options.nativeSampleRate >=
      this.options.targetFrameSize
    );
  }

  generateOutputFrame() {
    const outputFrame = new Float32Array(this.options.targetFrameSize);
    let outputIndex = 0;
    let inputIndex = 0;

    while (outputIndex < this.options.targetFrameSize) {
      let sum = 0;
      let num = 0;
      while (
        inputIndex <
        Math.min(
          this.inputBuffer.length,
          ((outputIndex + 1) * this.options.nativeSampleRate) /
            this.options.targetSampleRate
        )
      ) {
        const value = this.inputBuffer[inputIndex];
        if (value !== undefined) {
          sum += value;
          num++;
        }
        inputIndex++;
      }
      outputFrame[outputIndex] = sum / num;
      outputIndex++;
    }

    this.inputBuffer = this.inputBuffer.slice(inputIndex);
    return outputFrame;
  }
}

class WorkletProcessor extends AudioWorkletProcessor {
  static BUFFER_SIZE = 4096;
  static SAMPLE_RATE = 44100; // Change this to your desired sample rate

  constructor(options) {
    super();
    this.options = options.processorOptions;
    this.buffer = new Float32Array(WorkletProcessor.BUFFER_SIZE);
    this.byteWritten = 0;
    this.energyThreshold = 0.000000005; // talking in the mic
    this.speechDetected = false
    this.resampler = null;
    this._initialized = false;
    this._stopProcessing = false;

    this.init();
  }

  async init() {
    this.resampler = new Resampler({
      nativeSampleRate: WorkletProcessor.SAMPLE_RATE,
      targetSampleRate: 16000,
      targetFrameSize: this.options.frameSamples,
    });

    this._initialized = true;
    console.log('initialized worklet')
  }

  // # credit1: https://www.reddit.com/r/learnjavascript/comments/1buqjr3/solution_web_audio_replacing/
  // # credit2: https://dev.to/louisgv/quick-guide-to-audioworklet-30df
  // https://stackoverflow.com/questions/56592566/how-to-record-audio-using-audioworklet-and-audioworkletprocessor-in-javascript
  // https://stackoverflow.com/questions/25775704/html5-audio-api-inputbuffer-getchanneldata-to-audio-array-buffer
  // https://stackoverflow.com/questions/61264581/how-to-convert-audio-buffer-to-mp3-in-javascript
  process(inputs, _outputs, _parameters) {
    if (this._stopProcessing) {
      return false;
    }

    const input = inputs[0][0]; 

    // const isVoiceActive = this.detectVoiceActivity(input);

    // if (isVoiceActive) {
    //   this.append(input);
    // } else {
    //   if (this.byteWritten > 0 && !this.speechDetected) {
    //     this.flush()
    //   }
    // }

    this.port.postMessage({
      message: 'AUDIO_FRAME',
      data: input
    });

    // if (this._initialized && input instanceof Float32Array) {
    //   const frames = this.resampler.process(input);
    //   for (const frame of frames) {
    //     this.port.postMessage(
    //       { message: "AUDIO_FRAME", data: frame.buffer },
    //       [frame.buffer]
    //     )
    //   }
    // }

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
