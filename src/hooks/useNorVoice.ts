import { useEffect, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

const VAPI_PUBLIC_KEY = 'YOUR_VAPI_PUBLIC_KEY_HERE';

const ASSISTANT_ID = '9a6f0850-4849-4077-b84c-65d41a4aac8c';

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
