import { useEffect, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

const VAPI_PUBLIC_KEY = '2e09fd87-d7f6-4526-a6ee-93b02a692dd0';

const ASSISTANT_ID = '8f25d734-8451-499a-bd9b-65fbfae90f2c';

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
