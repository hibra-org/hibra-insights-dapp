import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

function AnimateLayout({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="pageInitial"
      animate="pageAnimate"
      exit="pageExit"
      variants={{
        pageInitial: {
          opacity: 0,
          y: 50,
        },
        pageAnimate: {
          opacity: 1,
          y: 0,
        },
        pageExit: {
          opacity: 0,
          y: -50,
        },
      }}
      transition={{
        type: 'tween',
        ease: 'easeInOut',
        duration: 0.5,
      }}
    >
      {children}
    </motion.div>
  );
}

export default AnimateLayout;
