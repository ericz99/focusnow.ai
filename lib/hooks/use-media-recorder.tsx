"use client";

import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { saveAudio } from "@/lib/audio";
import { useDataStore } from "@/lib/stores";

export type StatusMessages =
  | "media_aborted"
  | "permission_denied"
  | "no_specified_media_found"
  | "media_in_use"
  | "invalid_media_constraints"
  | "no_constraints"
  | "recorder_error"
  | "idle"
  | "acquiring_media"
  | "delayed_start"
  | "recording"
  | "stopping"
  | "stopped"
  | "paused";

export enum RecorderErrors {
  AbortError = "media_aborted",
  NotAllowedError = "permission_denied",
  NotFoundError = "no_specified_media_found",
  NotReadableError = "media_in_use",
  OverconstrainedError = "invalid_media_constraints",
  TypeError = "no_constraints",
  NONE = "",
  NO_RECORDER = "recorder_error",
}

export default function useMediaRecorder() {
  const { appendData } = useDataStore();
  const mediaChunks = useRef<Float32Array[]>([]);
  const mediaStream = useRef<MediaStream | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const audioSource = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioOutput = useRef<MediaDeviceInfo[]>([]);
  const lastSpeechDetectedTime = useRef<number | null>(null);
  const [_status, setStatus] = useState<StatusMessages>("idle");
  const [_error, setError] = useState<keyof typeof RecorderErrors>("NONE");
  const pauseRef = useRef<Boolean>(false);

  useEffect(() => {
    if (!window.navigator.mediaDevices.enumerateDevices) {
      throw new Error("enumerateDevices() not supported.");
    }

    // List all output devices.
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        audioOutput.current = devices.filter(
          (device) => device.kind === "audiooutput"
        );
      })
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`);
      });
  }, []);

  const getMediaStream = useCallback(async () => {
    console.log("ran");
    setStatus("acquiring_media");

    const constraints: MediaStreamConstraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
      },
      video: true,
    };

    try {
      const captureStream = await navigator.mediaDevices.getDisplayMedia(
        constraints
      );

      const ctx = new AudioContext({
        sampleRate: 44100,
      });

      // # remove video track
      captureStream.removeTrack(captureStream.getVideoTracks()[0]);

      mediaStream.current = captureStream;
      audioContext.current = ctx;
      audioSource.current = ctx.createMediaStreamSource(captureStream);
      setStatus("idle");
    } catch (error: any) {
      console.log(error);
      setError(error.name);
      setStatus("idle");
    }
  }, []);

  useEffect(() => {
    if (!window.MediaRecorder) {
      throw new Error("MediaRecorder: Unsupported Browser");
    }

    if (!window.MediaStream) {
      throw new Error("MediaStream: Unsupported Browser");
    }
  }, []);

  const configureStream = async () => {
    setError("NONE");

    console.log("configuring stream?");

    if (!mediaStream.current || !audioSource.current || !audioContext.current) {
      console.log("grabbing new media stream");
      await getMediaStream();
    }

    if (mediaStream.current && audioSource.current && audioContext.current) {
      console.log("found media stream");
      const isStreamEnded = mediaStream.current
        .getTracks()
        .some((track) => track.readyState === "ended");

      if (isStreamEnded) await getMediaStream();

      // User blocked the permissions (getMediaStream errored out)
      if (!mediaStream.current.active) {
        console.log("is not active");
        return false;
      }
    }

    return true;
  };

  const startStream = async () => {
    setError("NONE");

    console.log("starting stream?");

    if (pauseRef.current) {
      pauseRef.current = false;
      return;
    }

    const isActive = await configureStream();

    if (isActive) {
      if (mediaStream.current && audioSource.current && audioContext.current) {
        await audioContext.current.audioWorklet.addModule("/processor.js");

        const gainNode = audioContext.current.createGain();
        const audioDest = audioContext.current.createMediaStreamDestination();

        gainNode.connect(audioDest);
        gainNode.gain.value = 0.5;

        const node = new AudioWorkletNode(
          audioContext.current,
          "worklet-processor"
        );

        audioSource.current.connect(node).connect(gainNode).connect(audioDest);
        node.port.onmessage = onStreamData;
      }
    }
  };

  const onStreamData = (e: any) => {
    if (!pauseRef.current) {
      const { buffer, speechDetected } = e.data;
      const _buffer = new Float32Array(buffer);
      // console.log("incoming buffer -> ", _buffer);
      console.log("speechDetected", speechDetected);
      mediaChunks.current.push(_buffer);

      // # collect timestamp
      if (
        lastSpeechDetectedTime.current == null ||
        lastSpeechDetectedTime.current < Date.now()
      ) {
        lastSpeechDetectedTime.current = Date.now();
      }

      if (!speechDetected && lastSpeechDetectedTime.current != null) {
        console.log("lastSpeechDetectedTime", lastSpeechDetectedTime.current);

        setTimeout(() => {
          if (Date.now() - lastSpeechDetectedTime.current! > 500) {
            console.log("should collect");
            const blob = saveAudio(mediaChunks.current, audioContext.current);

            if (blob) {
              console.log("blob", blob);

              mediaChunks.current = [];
              appendData(blob);
            }
          }
        }, 500);
      }
    }
  };

  const stopStream = () => {
    if (!audioContext.current || !audioSource.current) return;
    pauseRef.current = true;
    console.log("Pausing audio source!");
  };

  return {
    startStream,
    stopStream,
    configureStream,
    outputs: audioOutput.current || [],
  };
}

export const ReactMediaRecorder = ({
  render,
}: {
  render: (props: {
    startStream: () => Promise<void>;
    stopStream: () => void;
    configureStream: () => Promise<Boolean>;
    outputs: MediaDeviceInfo[];
  }) => ReactElement;
}) => render(useMediaRecorder());
