import { useState, useEffect, useCallback } from 'react';

export function useAudioOutput() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string>('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'setSinkId' in HTMLMediaElement.prototype) {
      setIsSupported(true);
      refreshDevices();

      navigator.mediaDevices.addEventListener('devicechange', refreshDevices);
      return () => navigator.mediaDevices.removeEventListener('devicechange', refreshDevices);
    }
  }, []);

  const refreshDevices = async () => {
    try {
      const devs = await navigator.mediaDevices.enumerateDevices();
      const audioOutputs = devs.filter(d => d.kind === 'audiooutput');
      setDevices(audioOutputs);

      const current = audioOutputs.find(d => d.deviceId === 'default');
      if (current) setActiveDeviceId(current.deviceId);
    } catch (e) {
      console.warn("Audio Switching blocked by permission or OS");
    }
  };

  const toggleOutput = useCallback(async () => {
    if (!isSupported || devices.length < 2) return;

    const currentIndex = devices.findIndex(d => d.deviceId === activeDeviceId);
    const nextDevice = devices[(currentIndex + 1) % devices.length];

    const audioElements = document.querySelectorAll('audio');

    for (const audio of audioElements) {
      try {
        // @ts-ignore - setSinkId is experimental in TS types
        await audio.setSinkId(nextDevice.deviceId);
        console.log(`Switched audio to: ${nextDevice.label}`);
      } catch (e) {
        console.error("Failed to set audio output", e);
      }
    }

    setActiveDeviceId(nextDevice.deviceId);
  }, [devices, activeDeviceId, isSupported]);

  return { isSupported, toggleOutput, activeDeviceLabel: devices.find(d => d.deviceId === activeDeviceId)?.label || "Default" };
}
