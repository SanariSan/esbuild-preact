import { getElapsed, log, resetTimestamp } from '../util/index.js';

export const buildTracker = (when) => {
  return {
    name: `plugin-build-tracker-${when}`,
    setup: (build) => {
      if (when === 'start') {
        build.onStart(() => {
          resetTimestamp();
          log('warn', '===== Build started ⏳ ======');
        });
      } else if (when === 'end') {
        build.onEnd(() => {
          log('warn', `===== Build finished in ${getElapsed()} ms 🚀 ======\n`);
        });
      }
    },
  };
};
