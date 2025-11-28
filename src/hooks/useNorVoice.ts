import { useEffect, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

const VAPI_PUBLIC_KEY = 'c22f7257-a57e-4615-a547-98c01766d3c9';

const ASSISTANT_ID = 'Assistant Key';

const vapi = new Vapi(VAPI_PUBLIC_KEY);

export function useNorVoice() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const onCallStart = () => {
      console.log('NorVoice: Uplink Established');
      setIsSessionActive(true);
    };

    const onCallEnd = () => {
      console.log('NorVoice: Uplink Terminated');
      setIsSessionActive(false);
      setIsSpeaking(false);
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: any) => {
      console.error('NorVoice Error:', error);
      setIsSessionActive(false);
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.stop();
      vapi.removeAllListeners();
    };
  }, []);

  const toggleVoice = useCallback(() => {
    if (isSessionActive) {
      vapi.stop();
    } else {
      vapi.start(ASSISTANT_ID);
    }
  }, [isSessionActive]);

  return { isSessionActive, isSpeaking, toggleVoice };
}
