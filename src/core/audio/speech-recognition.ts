import { transcribeAudioWithDeepgram } from './deepgram';

export interface SpeechHandlerCallbacks {
  onTranscriptChange: (text: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onAudioLevel?: (level: number) => void;
}

export class UnifiedSpeechRecognizer {
  private recognition: any = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;
  private isListening = false;
  private deepgramKey?: string;

  constructor(deepgramKey?: string) {
    this.deepgramKey = deepgramKey;
  }

  public setDeepgramKey(key?: string) {
    this.deepgramKey = key;
  }

  public async startListening(callbacks: SpeechHandlerCallbacks): Promise<void> {
    if (this.isListening) return;
    this.isListening = true;

    try {
      // Setup microphone stream for audio visualizer & Deepgram recorder
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup Web Audio API Analyser for live frequency / volume metering
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioCtx();
        const source = this.audioContext.createMediaStreamSource(stream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        source.connect(this.analyser);

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const checkAudioLevel = () => {
          if (!this.isListening || !this.analyser) return;
          this.analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const avg = sum / bufferLength;
          if (callbacks.onAudioLevel) {
            callbacks.onAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
          }
          this.animFrameId = requestAnimationFrame(checkAudioLevel);
        };
        checkAudioLevel();
      } catch (err) {
        console.warn('Audio visualization not supported:', err);
      }

      // If Deepgram API key is present, record audio chunk and send to Deepgram on stop
      if (this.deepgramKey && this.deepgramKey.trim().length > 0) {
        this.audioChunks = [];
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            this.audioChunks.push(e.data);
          }
        };
        this.mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          try {
            const transcript = await transcribeAudioWithDeepgram(audioBlob, this.deepgramKey!);
            callbacks.onTranscriptChange(transcript, true);
          } catch (err: any) {
            callbacks.onError(`Deepgram STT failed: ${err.message}`);
          }
        };
        this.mediaRecorder.start();
        return;
      }

      // Fallback: Web Speech API (Free, Instant in Chrome/Edge)
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        callbacks.onError('Speech Recognition is not supported by your browser. Please type your response.');
        this.stopListening();
        return;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const currentText = final || interim;
        callbacks.onTranscriptChange(currentText, Boolean(final));
      };

      this.recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          callbacks.onError(`Microphone error: ${event.error}`);
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch {
            // Already restarted or disposed
          }
        }
      };

      this.recognition.start();
    } catch (err: any) {
      this.isListening = false;
      callbacks.onError(`Microphone access denied: ${err.message}`);
    }
  }

  public stopListening(): void {
    this.isListening = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
      this.recognition = null;
    }
  }

  public getListeningState(): boolean {
    return this.isListening;
  }
}
