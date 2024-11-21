import React from 'react';

interface IDimensions {
  width: number;
  height: number;
}

const getWindowDimensions = (): IDimensions => {
  const { innerWidth: width, innerHeight: height } = window;

  return {
    width,
    height,
  };
};

const useWindowDimensions = (): IDimensions => {
  const [windowDimensions, setWindowDimensions] =
    React.useState<IDimensions>(getWindowDimensions());

  React.useLayoutEffect(() => {
    /**
     * Handles the window resize event by updating the state with the new window dimensions.
     */
    const handleResize = (): void => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};

export default useWindowDimensions;
