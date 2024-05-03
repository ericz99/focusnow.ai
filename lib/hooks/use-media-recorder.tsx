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
  const [_status, setStatus] = useState<StatusMessages>("idle");
  const [_error, setError] = useState<keyof typeof RecorderErrors>("NONE");

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
      audio: true,
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

      // const stream = await window.navigator.mediaDevices.getUserMedia(
      //   constraints
      // );

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

    const isActive = await configureStream();

    if (isActive) {
      if (mediaStream.current && audioSource.current && audioContext.current) {
        await audioContext.current.audioWorklet.addModule("/processor.js");

        const node = new AudioWorkletNode(
          audioContext.current,
          "worklet-processor"
        );

        audioSource.current
          .connect(node)
          .connect(audioContext.current.destination);

        node.port.onmessage = onStreamData;

        setInterval(() => {
          console.log("disconnected done!");
          const b64 = saveAudio(mediaChunks.current, audioContext.current);
          console.log(b64);
          // mediaChunks.current = [];
          // audioSource.current?.disconnect();
          appendData(b64);
        }, 5000);
      }
    }
  };

  const onStreamData = (e: any) => {
    const inputData = e.data;
    const buffer = new Float32Array(inputData);
    console.log("incoming buffer -> ", buffer);
    mediaChunks.current.push(buffer);
  };

  const stopStream = () => {
    if (!audioContext.current || !audioSource.current) return;
    audioSource.current.disconnect();
    audioContext.current = null;
    audioSource.current = null;
    console.log("Disconnecting audio source!");
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
