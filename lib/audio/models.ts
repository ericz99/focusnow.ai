// @ts-nocheck
export type ONNXRuntimeAPI = any;
export type ModelFetcher = () => Promise<ArrayBuffer>;
export type OrtOptions = {
  ortConfig?: (ort: ONNXRuntimeAPI) => any;
};

export interface SpeechProbabilities {
  notSpeech: number;
  isSpeech: number;
}

export interface Model {
  reset_state: () => void;
  process: (arr: Float32Array) => Promise<SpeechProbabilities>;
}

export class Silero {
  _session;
  _h;
  _c;
  _sr;

  constructor(private ort: ONNXRuntimeAPI) {}

  static new = async (ort: ONNXRuntimeAPI) => {
    const model = new Silero(ort);
    await model.init();
    return model;
  };

  init = async () => {
    console.debug("initializing vad");
    this._session = await this.ort.InferenceSession.create(
      "/_next/static/chunks/silero_vad.onnx",
      {
        executionProviders: ["wasm"],
        graphOptimizationLevel: "all",
      }
    );
    // @ts-ignore
    this._sr = new this.ort.Tensor("int64", [16000n]);
    this.reset_state();
    console.debug("vad is initialized");
  };

  reset_state = () => {
    const zeroes = Array(2 * 64).fill(0);
    this._h = new this.ort.Tensor("float32", zeroes, [2, 1, 64]);
    this._c = new this.ort.Tensor("float32", zeroes, [2, 1, 64]);
  };

  process = async (audioFrame: Float32Array): Promise<SpeechProbabilities> => {
    const t = new this.ort.Tensor("float32", audioFrame, [
      1,
      audioFrame.length,
    ]);
    const inputs = {
      input: t,
      h: this._h,
      c: this._c,
      sr: this._sr,
    };
    const out = await this._session.run(inputs);
    this._h = out.hn;
    this._c = out.cn;
    const [isSpeech] = out.output.data;
    const notSpeech = 1 - isSpeech;
    return { notSpeech, isSpeech };
  };
}
