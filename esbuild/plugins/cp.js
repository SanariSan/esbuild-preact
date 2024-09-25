import { existsSync, cpSync } from 'fs';

export const cp = (from, to, when = 'end') => ({
  name: `cp-${when}`,
  setup: (build) => {
    const copy = () => {
      from.forEach((dir) => {
        if (existsSync(dir)) {
          cpSync(dir, to, { recursive: true });
        }
      });

      console.log(`Copied from ${from} to ${to} during ${when}`);
    };

    if (when === 'start') {
      build.onStart(copy);
    } else if (when === 'end') {
      build.onEnd(copy);
    }
  },
});
