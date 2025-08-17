import { motion } from 'framer-motion';

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: 'linear',
    },
  },
};

const spinnerColors = [
  { border: '#17d02b', borderTop: '#0dac1f' }, // primary
  { border: '#51785a', borderTop: '#41644a' }, // secondary
  { border: '#e9762b', borderTop: '#da5a1c' }, // tertiary
  { border: '#f4b740', borderTop: '#d1620e' }, // warning
  { border: '#e74c4c', borderTop: '#d32f2f' }, // error
];

const Loading = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f9fafb',
    }}
  >
    <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
      {spinnerColors.map((color, idx) => (
        <motion.div
          key={idx}
          variants={spinnerVariants}
          animate="animate"
          style={{
            width: 40,
            height: 40,
            border: `6px solid ${color.border}`,
            borderTop: `6px solid ${color.borderTop}`,
            borderRadius: '50%',
          }}
        />
      ))}
    </div>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ color: '#6366f1', fontWeight: 600, fontSize: 18 }}
    >
      Loading...
    </motion.div>
  </div>
);

export default Loading;
