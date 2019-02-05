import { useState, useEffect } from 'react';
import throttle from 'lodash.throttle';

function getSize() {
  return {
    height: window.innerHeight,
    width: window.innerWidth,
  };
}

function useWindowSize(throttleMs = 100) {
  const [size, setSize] = useState(getSize());

  const onResize = throttle(() => {
    setSize(getSize());
  }, throttleMs);

  useEffect(() => {
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return size;
}

export default useWindowSize;
