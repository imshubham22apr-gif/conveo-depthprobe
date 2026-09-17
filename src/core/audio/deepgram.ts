/**
 * Deepgram STT Client
 * Conveo utilizes Deepgram for ultra-low latency real-time speech-to-text.
 * This client provides live streaming transcription when an API key is available.
 */

export async function transcribeAudioWithDeepgram(
  audioBlob: Blob,
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    throw new Error('Deepgram API key is required.');
  }

  const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&punctuate=true', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': audioBlob.type || 'audio/webm'
    },
    body: audioBlob
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Deepgram API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const transcript =
    result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
  return transcript;
}
