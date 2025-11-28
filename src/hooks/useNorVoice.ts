import { useEffect, useState, useCallback, useRef } from 'react';
import Vapi from '@vapi-ai/web';

const VAPI_PUBLIC_KEY = '2e09fd87-d7f6-4526-a6ee-93b02a692dd0';
const ASSISTANT_ID = 'cb741d7a-79c5-499c-9405-275612dad372';

let vapiInstance: any = null;
function getVapi() {
  if (!vapiInstance) {
    vapiInstance = new Vapi(VAPI_PUBLIC_KEY);
  }
  return vapiInstance;
}

export function useNorVoice() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const vapi = getVapi();

    const onCallStart = () => {
      console.log('NorVoice: Connected');
      if (isMounted.current) {
        setIsSessionActive(true);
        setIsLoading(false);
      }
    };

    const onCallEnd = () => {
      console.log('NorVoice: Disconnected');
      if (isMounted.current) {
        setIsSessionActive(false);
        setIsSpeaking(false);
        setIsLoading(false);
      }
    };

    const onSpeechStart = () => {
      if (isMounted.current) setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      if (isMounted.current) setIsSpeaking(false);
    };

    const onError = (err: any) => {
      console.error('NorVoice Error:', err);
      if (isMounted.current) {
        setIsSessionActive(false);
        setIsLoading(false);
      }
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      isMounted.current = false;
      vapi.removeAllListeners();
    };
  }, []);

  const toggleVoice = useCallback(async () => {
    const vapi = getVapi();

    if (isSessionActive) {
      vapi.stop();
    } else {
      setIsLoading(true);
      try {
        await vapi.start(ASSISTANT_ID);
      } catch (e) {
        console.error("Failed to start Vapi:", e);
        setIsLoading(false);
      }
    }
  }, [isSessionActive]);

  return { isSessionActive, isSpeaking, isLoading, toggleVoice };
}
