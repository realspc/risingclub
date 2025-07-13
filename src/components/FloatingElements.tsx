import { motion } from 'framer-motion';

const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated background particles */}
      <motion.div
        className="absolute w-64 h-64 bg-gradient-to-r from-blue-400/20 to-[#22b0fc]/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '10%', left: '10%' }}
      />
      
      <motion.div
        className="absolute w-48 h-48 bg-gradient-to-r from-cyan-400/20 to-[#22b0fc]/20 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 120, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{ top: '60%', right: '10%' }}
      />
      
      <motion.div
        className="absolute w-32 h-32 bg-gradient-to-r from-indigo-400/20 to-[#22b0fc]/20 rounded-full blur-2xl"
        animate={{
          x: [0, 60, 0],
          y: [0, -60, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
        style={{ bottom: '20%', left: '20%' }}
      />
      
      {/* Glowing orbs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#22b0fc]/60 rounded-full"
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          style={{
            left: `${20 + i * 15}%`,
            top: '100%',
          }}
        />
      ))}
    </div>
  );
};

export default FloatingElements;