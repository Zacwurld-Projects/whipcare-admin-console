import Lottie from 'lottie-react';
import animatedData from '@/app/assets/animations/Preloader.json';

const AnimatedLoader = () => {
  return (
    <Lottie
      animationData={animatedData}
      rendererSettings={{
        preserveAspectRatio: 'xMidYMid slice',
      }}
      loop={true}
      style={{ width: 400, height: 300 }}
    />
  );
};
export default AnimatedLoader;
