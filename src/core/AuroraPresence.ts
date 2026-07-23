import { useState, useEffect, useRef } from "react";
import { AuroraState } from "./LivingStateEngine";

export interface AuroraPresenceConfig {
  eyesX: number;       // Pupil X offset (px)
  eyesY: number;       // Pupil Y offset (px)
  headRotate: number;   // Head tilt angle (degrees)
  headY: number;        // Head breathing vertical offset (px)
  shoulderY: number;    // Shoulder breathing vertical offset (px)
  isBlinking: boolean;  // Is blinking eyes closed
  mugY: number;         // Coffee mug vertical position (px)
  mouthYScale: number;  // Mouth open ratio (0 to 1)
  lookTarget: 'user' | 'laptop' | 'lake' | 'notebook' | 'away' | 'down';
  bodyRotate: number;   // Body orientation angle (degrees)
}

export function useAuroraPresence(state: AuroraState): AuroraPresenceConfig {
  const [isBlinking, setIsBlinking] = useState(false);
  const [breathProgress, setBreathProgress] = useState(0); // 0 to 2PI
  const [lookTarget, setLookTarget] = useState<'user' | 'laptop' | 'lake' | 'notebook' | 'away' | 'down'>('laptop');
  const [mouthYScale, setMouthYScale] = useState(0);

  const lookTimerRef = useRef<any>(null);
  const blinkTimerRef = useRef<any>(null);
  const speechTimerRef = useRef<any>(null);

  // 1. Breathing Cycle (4.5s period)
  useEffect(() => {
    let animationFrameId: number;
    let startTime = Date.now();

    const updateBreathing = () => {
      const elapsed = Date.now() - startTime;
      const period = 4500; // 4.5 seconds cycle
      const progress = ((elapsed % period) / period) * 2 * Math.PI;
      setBreathProgress(progress);
      animationFrameId = requestAnimationFrame(updateBreathing);
    };

    animationFrameId = requestAnimationFrame(updateBreathing);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // 2. Random Blinking (every 3 to 8 seconds, lasting 150ms)
  useEffect(() => {
    const scheduleNextBlink = () => {
      const delay = 3000 + Math.random() * 5000; // 3 - 8s
      blinkTimerRef.current = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 150);
      }, delay);
    };

    scheduleNextBlink();
    return () => {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    };
  }, []);

  // 3. Dynamic Eye & Head Looking Gaze Selector based on State
  useEffect(() => {
    // Clear any dynamic look timer when state changes
    if (lookTimerRef.current) {
      clearTimeout(lookTimerRef.current);
    }

    // Map initial look target from state
    switch (state) {
      case 'Listening':
        setLookTarget('user');
        break;
      case 'Thinking':
        setLookTarget('away');
        break;
      case 'Working':
        setLookTarget('laptop');
        break;
      case 'CoffeeBreak':
        setLookTarget('user');
        break;
      case 'WatchingLake':
        setLookTarget('lake');
        break;
      case 'Reading':
        setLookTarget('down');
        break;
      case 'Writing':
        setLookTarget('notebook');
        break;
      case 'Speaking':
        setLookTarget('user');
        break;
      default:
        setLookTarget('user');
    }

    // For open/relaxed states, occasionally schedule minor eyes shifts to look around
    if (state === 'Relaxing' || state === 'CoffeeBreak' || state === 'WatchingLake') {
      const scheduleLookShift = () => {
        const delay = 6000 + Math.random() * 8000;
        lookTimerRef.current = setTimeout(() => {
          setLookTarget(prev => {
            if (prev === 'user') return Math.random() > 0.5 ? 'lake' : 'away';
            return 'user';
          });
          scheduleLookShift();
        }, delay);
      };
      scheduleLookShift();
    }

    return () => {
      if (lookTimerRef.current) clearTimeout(lookTimerRef.current);
    };
  }, [state]);

  // 4. Subtle Mouth Movement when speaking
  useEffect(() => {
    if (state === 'Speaking') {
      const speakAnimate = () => {
        // Random rapid open/close sequence for speech
        setMouthYScale(0.1 + Math.random() * 0.9);
        speechTimerRef.current = setTimeout(speakAnimate, 120 + Math.random() * 150);
      };
      speakAnimate();
    } else {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      setMouthYScale(0);
    }

    return () => {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    };
  }, [state]);

  // Calculate configuration values
  const sinB = Math.sin(breathProgress);
  const headY = sinB * 0.9;         // extremely small 0.9px breathing movement
  const shoulderY = sinB * 0.45;     // 0.45px shoulder movement

  // Eyes coordinates (offset from center in pixels)
  let eyesX = 0;
  let eyesY = 0;
  let headRotate = 0;
  let bodyRotate = 0;
  let mugY = 0; // Mug raised is -18px, resting is 0px

  // Look direction calculations
  switch (lookTarget) {
    case 'user':
      eyesX = 0;
      eyesY = -0.5;
      headRotate = 0.5 * sinB; // super subtle head sway while looking at user
      break;
    case 'laptop':
      eyesX = -2.5;
      eyesY = 1.5;
      headRotate = -1.5; // turned slightly down-left
      break;
    case 'lake':
      eyesX = 2.8;
      eyesY = -0.5;
      headRotate = 3;    // turned right towards window/lake
      bodyRotate = 1.5;
      break;
    case 'notebook':
      eyesX = -2.0;
      eyesY = 2.2;
      headRotate = -2.5; // looking down-left
      break;
    case 'away':
      eyesX = 1.5;
      eyesY = -1.8;
      headRotate = 2;    // reflective posture
      break;
    case 'down':
      eyesX = 0;
      eyesY = 2.5;
      headRotate = -1;
      break;
  }

  // Coffee Break state details (raise mug)
  if (state === 'CoffeeBreak') {
    mugY = -16; // Lifted up to drink
  } else {
    mugY = 0;   // Resting
  }

  // State specific postures
  if (state === 'Thinking') {
    headRotate += 1.8; // tilt head contemplatively
  } else if (state === 'Reading') {
    headRotate -= 1.2;
  }

  return {
    eyesX,
    eyesY,
    headRotate,
    headY,
    shoulderY,
    isBlinking,
    mugY,
    mouthYScale,
    lookTarget,
    bodyRotate
  };
}
