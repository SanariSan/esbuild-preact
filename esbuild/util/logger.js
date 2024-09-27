let ts = performance.now();
const levelMap = {
  off: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

export const resetTimestamp = () => {
  ts = performance.now();
};

export const getElapsed = () => {
  const now = performance.now();
  const elapsedMs = now - ts;
  const ms = (elapsedMs % 1000).toFixed(4);

  return ms;
};

/**
 * @param {'debug' | 'info' | 'warn' | 'error'} level
 * @param {...any} args
 */
export const log = (level, ...args) => {
  const inputLevelNum = levelMap[level];
  const requiredLevelNum = levelMap[process.env.ESBUILD_LOG_LEVEL || 'info'];

  if (inputLevelNum <= requiredLevelNum) {
    console.log(`[T+${getElapsed()} ms] [${level}]`, ...args);
  }
};
