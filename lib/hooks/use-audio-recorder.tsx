"use client";

import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { saveAudio } from "@/lib/audio/audio";
import { useDataStore, useDeepgram } from "@/lib/stores";
import { Message } from "@/lib/audio/messages";

import {
  LiveClient,
  LiveConnectionState,
  LiveTranscriptionEvents,
  type LiveSchema,
  type LiveTranscriptionEvent,
} from "@deepgram/sdk";

import deepgram from "@/server/deepgram";

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
  //   const mediaStream = useRef<MediaStream | null>(null);
  //   const audioContext = useRef<AudioContext | null>(null);
  //   const audioSource = useRef<MediaStreamAudioSourceNode | null>(null);
  //   const audioOutput = useRef<MediaDeviceInfo[]>([]);
  const lastSpeechDetectedTime = useRef<number | null>(null);
  const [_status, setStatus] = useState<StatusMessages>("idle");
  const [_error, setError] = useState<keyof typeof RecorderErrors>("NONE");
  const pauseRef = useRef<Boolean>(false);
  const captionTimeout = useRef<any>();
  const keepAliveInterval = useRef<any>();
  const [isConnected, setConnected] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioSource, setAudioSource] =
    useState<MediaStreamAudioSourceNode | null>(null);
  const [audioOutput, setAudioOutput] = useState<MediaDeviceInfo[]>([]);
  const [audioNode, setAudioNode] = useState<AudioWorkletNode | null>();
  const [gainNode, setGainNode] = useState<GainNode | null>();
  const [audioDest, setAudioDest] =
    useState<MediaStreamAudioDestinationNode | null>();
  const [caption, setCaption] = useState<string | undefined>();
  const { connection, connectionState, connectToDeepgram, isReadyState } =
    useDeepgram();

  useEffect(() => {
    if (!window.navigator.mediaDevices.enumerateDevices) {
      throw new Error("enumerateDevices() not supported.");
    }

    // List all output devices.
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        setAudioOutput(
          devices.filter((device) => device.kind === "audiooutput")
        );
      })
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`);
      });
  }, []);

  useEffect(() => {
    connectToDeepgram({
      model: "nova-2",
      interim_results: true,
      smart_format: true,
      filler_words: true,
      utterance_end_ms: 3000,
    });
  }, []);

  useEffect(() => {
    if (!connection) return;

    const scheduleTimer = async () => {
      let timer: any = null;
      const isReady = await isReadyState();
      console.log("isready", isReady);
      console.log("running timer!");

      timer = setInterval(async () => {
        const isReady = await isReadyState();
        console.log("isready", isReady);
        if (isReady == 1) {
          setConnected(true);
          clearInterval(timer);
        }
      }, 1000);
    };

    scheduleTimer();
  }, [connection]);

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

      const ctx = new AudioContext();

      // # remove video track
      captureStream.removeTrack(captureStream.getVideoTracks()[0]);

      setMediaStream(captureStream);
      setAudioContext(ctx);
      setAudioSource(ctx.createMediaStreamSource(captureStream));

      setStatus("idle");
    } catch (error: any) {
      console.log(error);
      setError(error.name);
      setStatus("idle");
    }
  }, []);

  useEffect(() => {
    if (!connection) return;

    if (connectionState === LiveConnectionState.OPEN && isConnected) {
      connection.keepAlive();

      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000);
    } else {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      clearInterval(keepAliveInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionState, isConnected]);

  useEffect(() => {
    if (!window.MediaRecorder) {
      throw new Error("MediaRecorder: Unsupported Browser");
    }

    if (!window.MediaStream) {
      throw new Error("MediaStream: Unsupported Browser");
    }
  }, []);

  useEffect(() => {
    if (!connection) return;
    if (
      !audioNode ||
      !audioSource ||
      !audioContext ||
      !gainNode ||
      !audioDest ||
      !isConnected
    ) {
      console.log("not run");
      return;
    }

    console.log("run");

    const onMessage = async (e: any) => {
      console.log("connectionState", connectionState);
      const readyState = await isReadyState();

      switch (e.data.message) {
        case Message.AudioFrame:
          const buffer = e.data.data;
          const frame = new Float32Array(buffer);

          if (connection) {
            connection.send(frame);
          }
          break;
        default:
          break;
      }
    };

    const onTranscript = (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
      let thisCaption = data.channel.alternatives[0].transcript;

      console.log("thisCaption", thisCaption);
      if (thisCaption !== "") {
        console.log('thisCaption !== ""', thisCaption);
        setCaption(thisCaption);
      }

      if (isFinal && speechFinal) {
        clearTimeout(captionTimeout.current);
        captionTimeout.current = setTimeout(() => {
          setCaption(undefined);
          clearTimeout(captionTimeout.current);
        }, 3000);
      }
    };

    if (
      connectionState === LiveConnectionState.OPEN &&
      audioNode &&
      isConnected
    ) {
      console.log("is activeltiyawg");
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      audioNode.port.onmessage = onMessage;
    }

    return () => {
      connection.removeListener(
        LiveTranscriptionEvents.Transcript,
        onTranscript
      );
      audioNode.port.removeEventListener("message", onMessage);
      clearTimeout(captionTimeout.current);
    };
  }, [
    audioContext,
    audioDest,
    audioNode,
    audioSource,
    connection,
    connectionState,
    gainNode,
    isConnected,
  ]);

  const configureStream = async () => {
    setError("NONE");

    console.log("configuring stream?");

    if (!mediaStream || !audioSource || !audioContext) {
      console.log("grabbing new media stream");
      await getMediaStream();
    }

    if (mediaStream && audioSource && audioContext) {
      console.log("found media stream");
      const isStreamEnded = mediaStream
        .getTracks()
        .some((track) => track.readyState === "ended");

      if (isStreamEnded) await getMediaStream();

      // User blocked the permissions (getMediaStream errored out)
      if (!mediaStream.active) {
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
      if (mediaStream && audioSource && audioContext) {
        await audioContext.audioWorklet.addModule("/processor.js");

        const gainNode = audioContext.createGain();
        const audioDest = audioContext.createMediaStreamDestination();

        gainNode.connect(audioDest);
        gainNode.gain.value = 0.5;

        const node = new AudioWorkletNode(audioContext, "worklet-processor", {
          processorOptions: {
            frameSamples: 1536,
          },
        });

        setAudioNode(node);
        setGainNode(gainNode);
        setAudioDest(audioDest);

        audioSource.connect(node).connect(gainNode).connect(audioDest);

        // audioSource.current.connect(node).connect(gainNode).connect(audioDest);
        // node.port.onmessage = async (e: any) => {
        //   console.log("e", e);
        // };
      }
    }
  };

  const stopStream = () => {
    if (!audioContext || !audioSource) return;
    pauseRef.current = true;
    console.log("Pausing audio source!");
  };

  const disconnectStream = () => {
    const stream = mediaStream;

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  return {
    startStream,
    stopStream,
    configureStream,
    disconnectStream,
    outputs: audioOutput || [],
  };
}

export const ReactMediaRecorder = ({
  render,
}: {
  render: (props: {
    startStream: () => Promise<void>;
    stopStream: () => void;
    disconnectStream: () => void;
    configureStream: () => Promise<Boolean>;
    outputs: MediaDeviceInfo[];
  }) => ReactElement;
}) => render(useMediaRecorder());
