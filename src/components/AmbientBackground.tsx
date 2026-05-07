import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AmbientBackgroundProps {
  isSubdued: boolean;
}

const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ isSubdued }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Spring configuration for smooth parallax
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position (-0.5 to 0.5)
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Transform mouse movement into subtle parallax shifts (3px range)
  const translateX = useTransform(mouseX, [-0.5, 0.5], ['-3px', '3px']);
  const translateY = useTransform(mouseY, [-0.5, 0.5], ['-3px', '3px']);

  return (
    <div className={`ambient-bg-container ${isSubdued ? 'ambient-bg-subdued' : ''}`}>
      <motion.div 
        style={{ x: translateX, y: translateY }}
        className="ambient-mesh"
      />
      <div className="ambient-blob ambient-blob-1" />
      <div className="ambient-blob ambient-blob-2" />
      <div className="ambient-noise" />
    </div>
  );
};

export default AmbientBackground;
