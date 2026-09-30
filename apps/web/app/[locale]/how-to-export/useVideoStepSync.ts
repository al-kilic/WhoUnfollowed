import { useCallback, useEffect, useRef, useState } from 'react';
import { CHAPTER_STARTS, chapterAt, chapterSeekTime } from './videoChapters';

// How long a step has to sit in the reading band before the video follows it,
// so a fast scroll past several steps causes one seek, not one per step.
const SCROLL_SEEK_DELAY_MS = 300;

// Keeps the video guide and the step list in step with each other:
//  - playback crossing a chapter boundary moves `activeStep`
//  - clicking a step (or a chapter segment) seeks the video
//  - scrolling a different step into the reading band seeks the video to it
// The page is never scrolled programmatically, so the two cannot fight.
export function useVideoStepSync(enabled: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const activeRef = useRef(0);
  // True once the viewer paused on purpose: nothing auto-resumes after that.
  const userPaused = useRef(false);

  const syncTime = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    // Drives the chapter bar fill through a CSS variable, no re-render.
    barRef.current?.style.setProperty('--t', video.currentTime.toFixed(2));
    const index = chapterAt(video.currentTime);
    if (index !== activeRef.current) {
      activeRef.current = index;
      setActiveStep(index);
    }
  }, []);

  const play = useCallback(() => {
    // Autoplay can be refused (iOS Low Power Mode): the play overlay stays up.
    videoRef.current?.play().catch(() => {});
  }, []);

  const seekToStep = useCallback((index: number) => {
    const video = videoRef.current;
    if (!video || index < 0 || index >= CHAPTER_STARTS.length) return;
    video.currentTime = chapterSeekTime(index);
    activeRef.current = index;
    setActiveStep(index);
    barRef.current?.style.setProperty('--t', video.currentTime.toFixed(2));
  }, []);

  const watchStep = useCallback((index: number) => {
    userPaused.current = false;
    seekToStep(index);
    play();
  }, [seekToStep, play]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      play();
    } else {
      userPaused.current = true;
      video.pause();
    }
  }, [play]);

  // Smooth chapter-bar fill while playing (timeupdate alone fires ~4x/second).
  useEffect(() => {
    if (!playing) return;
    let frame = requestAnimationFrame(function tick() {
      syncTime();
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [playing, syncTime]);

  // Autoplay (muted) unless the visitor asked for reduced motion, and pause
  // while the video is scrolled out of view.
  useEffect(() => {
    const video = videoRef.current;
    if (!enabled || !video) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting) {
        if (!reducedMotion && !userPaused.current) play();
      } else {
        video.pause();
      }
    }, { threshold: 0.25 });
    observer.observe(video);
    return () => observer.disconnect();
  }, [enabled, play]);

  // Scroll -> seek: the step crossing a line 45% down the viewport (just under
  // the pinned video on a phone) is the one being read. A zero-height band
  // means at most one step matches at a time.
  useEffect(() => {
    const container = stepsRef.current;
    if (!enabled || !container) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver((entries) => {
      const hit = [...entries].reverse().find((entry) => entry.isIntersecting);
      const index = Number((hit?.target as HTMLElement | undefined)?.dataset.step);
      if (!hit || Number.isNaN(index)) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (index !== activeRef.current) seekToStep(index);
      }, SCROLL_SEEK_DELAY_MS);
    }, { rootMargin: '-45% 0px -55% 0px' });
    container.querySelectorAll('[data-step]').forEach((el) => observer.observe(el));
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [enabled, seekToStep]);

  // The pinned video sits right under the sticky site nav, whose height is not
  // fixed: publish it as a CSS variable for the .export-video sticky offset.
  useEffect(() => {
    const nav = document.querySelector('nav');
    if (!enabled || !nav) return;
    const publish = () => document.documentElement.style.setProperty('--export-nav-h', `${nav.offsetHeight}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [enabled]);

  return { videoRef, barRef, stepsRef, activeStep, playing, setPlaying, syncTime, seekToStep: watchStep, togglePlay };
}

export type VideoStepSync = ReturnType<typeof useVideoStepSync>;
