import { useCallback } from 'react';

type SoundType =
  | 'place'
  | 'explosion'
  | 'victory'
  | 'defeat'
  | 'invalid'
  | 'restart'
  | 'aiPlace'
  | 'playerPlace';

export const useSoundEffects = () => {
  const playSound = useCallback((soundType: SoundType) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioContext.currentTime;

    switch (soundType) {
      case 'place': {
        // Generic bouncy "bloop" - fallback
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain).connect(audioContext.destination);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }

      case 'playerPlace': {
        // Cheerful human "pop" sound
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain).connect(audioContext.destination);
        osc.start(now);
        osc.stop(now + 0.18);

        // Add a little sparkle
        const sparkle = audioContext.createOscillator();
        const sparkleGain = audioContext.createGain();
        sparkle.type = 'triangle';
        sparkle.frequency.value = 1200;
        sparkleGain.gain.setValueAtTime(0.08, now + 0.05);
        sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        sparkle.connect(sparkleGain).connect(audioContext.destination);
        sparkle.start(now + 0.05);
        sparkle.stop(now + 0.15);
        break;
      }

      case 'aiPlace': {
        // Robotic/digital AI sound
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.04);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain).connect(audioContext.destination);
        osc.start(now);
        osc.stop(now + 0.15);

        // Add digital "beep" layer
        const beep = audioContext.createOscillator();
        const beepGain = audioContext.createGain();
        beep.type = 'sawtooth';
        beep.frequency.setValueAtTime(800, now + 0.02);
        beep.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        beepGain.gain.setValueAtTime(0.1, now + 0.02);
        beepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        beep.connect(beepGain).connect(audioContext.destination);
        beep.start(now + 0.02);
        beep.stop(now + 0.1);

        // Subtle processing sound
        const processing = audioContext.createOscillator();
        const processingGain = audioContext.createGain();
        processing.type = 'square';
        processing.frequency.value = 150;
        processingGain.gain.setValueAtTime(0.05, now + 0.08);
        processingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        processing.connect(processingGain).connect(audioContext.destination);
        processing.start(now + 0.08);
        processing.stop(now + 0.12);
        break;
      }

      case 'explosion': {
        // Cartoon "KAPOW!" with multiple layers
        // Bass thump
        const bass = audioContext.createOscillator();
        const bassGain = audioContext.createGain();
        bass.type = 'square';
        bass.frequency.setValueAtTime(80, now);
        bass.frequency.exponentialRampToValueAtTime(30, now + 0.2);
        bassGain.gain.setValueAtTime(0.3, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        bass.connect(bassGain).connect(audioContext.destination);
        bass.start(now);
        bass.stop(now + 0.2);

        // Crackling mid frequencies
        [200, 300, 450].forEach((freq, i) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + i * 0.02);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.3, now + i * 0.02 + 0.15);
          gain.gain.setValueAtTime(0.15, now + i * 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.02 + 0.15);
          osc.connect(gain).connect(audioContext.destination);
          osc.start(now + i * 0.02);
          osc.stop(now + i * 0.02 + 0.15);
        });

        // High pitch "zing"
        const zing = audioContext.createOscillator();
        const zingGain = audioContext.createGain();
        zing.type = 'sine';
        zing.frequency.setValueAtTime(2000, now + 0.1);
        zing.frequency.exponentialRampToValueAtTime(3000, now + 0.25);
        zingGain.gain.setValueAtTime(0.1, now + 0.1);
        zingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        zing.connect(zingGain).connect(audioContext.destination);
        zing.start(now + 0.1);
        zing.stop(now + 0.25);
        break;
      }

      case 'victory': {
        // Epic 8-bit victory fanfare with harmony
        const melody = [523, 659, 784, 1047]; // C, E, G, C
        const harmony = [415, 523, 622, 831]; // G#, C, D#, G#

        melody.forEach((freq, i) => {
          // Main melody
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.type = 'square';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.2, now + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.2);
          osc.connect(gain).connect(audioContext.destination);
          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 0.2);

          // Harmony layer
          const harmOsc = audioContext.createOscillator();
          const harmGain = audioContext.createGain();
          harmOsc.type = 'triangle';
          harmOsc.frequency.value = harmony[i];
          harmGain.gain.setValueAtTime(0.12, now + i * 0.15);
          harmGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.2);
          harmOsc.connect(harmGain).connect(audioContext.destination);
          harmOsc.start(now + i * 0.15);
          harmOsc.stop(now + i * 0.15 + 0.2);
        });

        // Victory bells
        [1320, 1760, 2200].forEach((freq, i) => {
          const bell = audioContext.createOscillator();
          const bellGain = audioContext.createGain();
          bell.type = 'sine';
          bell.frequency.value = freq;
          bellGain.gain.setValueAtTime(0.15, now + 0.6 + i * 0.1);
          bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6 + i * 0.1 + 0.3);
          bell.connect(bellGain).connect(audioContext.destination);
          bell.start(now + 0.6 + i * 0.1);
          bell.stop(now + 0.6 + i * 0.1 + 0.3);
        });
        break;
      }

      case 'defeat': {
        // Dramatic "wah wah wahhh" trombone effect
        const notes = [440, 369, 311, 277]; // A, F#, D#, C#

        notes.forEach((freq, i) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + i * 0.25);
          // Add slight wobble for more dramatic effect
          osc.frequency.exponentialRampToValueAtTime(freq * 0.95, now + i * 0.25 + 0.3);
          gain.gain.setValueAtTime(0.18, now + i * 0.25);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.35);
          osc.connect(gain).connect(audioContext.destination);
          osc.start(now + i * 0.25);
          osc.stop(now + i * 0.25 + 0.35);
        });

        // Add a final deep "thud"
        const thud = audioContext.createOscillator();
        const thudGain = audioContext.createGain();
        thud.type = 'square';
        thud.frequency.setValueAtTime(100, now + 1);
        thud.frequency.exponentialRampToValueAtTime(50, now + 1.2);
        thudGain.gain.setValueAtTime(0.25, now + 1);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        thud.connect(thudGain).connect(audioContext.destination);
        thud.start(now + 1);
        thud.stop(now + 1.2);
        break;
      }

      case 'invalid': {
        // Buzzer + silly "nope nope" sound
        const buzzer = audioContext.createOscillator();
        const buzzerGain = audioContext.createGain();
        buzzer.type = 'square';
        buzzer.frequency.setValueAtTime(150, now);
        buzzerGain.gain.setValueAtTime(0.15, now);
        buzzerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        buzzer.connect(buzzerGain).connect(audioContext.destination);
        buzzer.start(now);
        buzzer.stop(now + 0.12);

        // Quick "nuh-uh" melody
        [300, 250, 200].forEach((freq, i) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.1, now + 0.15 + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15 + i * 0.08 + 0.06);
          osc.connect(gain).connect(audioContext.destination);
          osc.start(now + 0.15 + i * 0.08);
          osc.stop(now + 0.15 + i * 0.08 + 0.06);
        });
        break;
      }

      case 'restart': {
        // Magical "sparkle" startup sequence
        // Rising arpeggio
        const notes = [261, 329, 392, 523, 659]; // C major pentatonic

        notes.forEach((freq, i) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.15, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
          osc.connect(gain).connect(audioContext.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.2);
        });

        // Sparkle effects
        [880, 1320, 1760, 2200].forEach((freq, i) => {
          const sparkle = audioContext.createOscillator();
          const sparkleGain = audioContext.createGain();
          sparkle.type = 'triangle';
          sparkle.frequency.value = freq;
          sparkleGain.gain.setValueAtTime(0.08, now + 0.3 + i * 0.05);
          sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + i * 0.05 + 0.15);
          sparkle.connect(sparkleGain).connect(audioContext.destination);
          sparkle.start(now + 0.3 + i * 0.05);
          sparkle.stop(now + 0.3 + i * 0.05 + 0.15);
        });

        // Final "ding!"
        const ding = audioContext.createOscillator();
        const dingGain = audioContext.createGain();
        ding.type = 'sine';
        ding.frequency.value = 1760;
        dingGain.gain.setValueAtTime(0.2, now + 0.6);
        dingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        ding.connect(dingGain).connect(audioContext.destination);
        ding.start(now + 0.6);
        ding.stop(now + 0.9);
        break;
      }

      default:
        break;
    }
  }, []);

  return { playSound };
};
