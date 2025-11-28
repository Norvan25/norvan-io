import { useEffect, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

const VAPI_PUBLIC_KEY = 'c22f7257-a57e-4615-a547-98c01766d3c9';

const ASSISTANT_ID = '9a6f0850-4849-4077-b84c-65d41a4aac8c';

const vapi = new Vapi(VAPI_PUBLIC_KEY);

export function useNorVoice() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const onCallStart = () => {
      console.log('NorVoice: System Connected');
      setIsSessionActive(true);
      setIsLoading(false);
    };

    const onCallEnd = () => {
      console.log('NorVoice: System Disconnected');
      setIsSessionActive(false);
      setIsSpeaking(false);
      setIsLoading(false);
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: any) => {
      console.error('NorVoice Critical Error:', error);
      setIsSessionActive(false);
      setIsLoading(false);
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
      console.log('NorVoice: Stopping...');
      vapi.stop();
    } else {
      console.log('NorVoice: Initializing...');
      setIsLoading(true);
      try {
        vapi.start(ASSISTANT_ID);
      } catch (e) {
        console.error("Failed to start Vapi:", e);
        setIsLoading(false);
      }
    }
  }, [isSessionActive]);

  return { isSessionActive, isSpeaking, isLoading, toggleVoice };
}
