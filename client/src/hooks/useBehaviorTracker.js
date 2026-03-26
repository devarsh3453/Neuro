import { useRef, useEffect } from 'react';

export default function useBehaviorTracker() {
  const startTime = useRef(null);
  const firstInputTime = useRef(null);
  const editCount = useRef(0);
  const hasFirstInput = useRef(false);

  useEffect(() => {
    startTime.current = Date.now();
  }, []);

  const recordFirstInput = () => {
    if (!hasFirstInput.current) {
      firstInputTime.current = Date.now();
      hasFirstInput.current = true;
    }
  };

  const recordEdit = () => {
    editCount.current += 1;
  };

  const getMetrics = () => {
    return {
      timeToFirstInput: firstInputTime.current 
        ? firstInputTime.current - startTime.current 
        : 0,
      editCount: editCount.current,
      totalTime: startTime.current 
        ? Math.round((Date.now() - startTime.current) / 1000) 
        : 0
    };
  };

  const resetTracker = () => {
    startTime.current = Date.now();
    firstInputTime.current = null;
    editCount.current = 0;
    hasFirstInput.current = false;
  };

  return { recordFirstInput, recordEdit, getMetrics, resetTracker };
}
