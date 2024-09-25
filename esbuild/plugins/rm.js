import { rmSync, existsSync } from 'fs';

export const rm = (dirs, when = 'end') => ({
  name: `rm-${when}`,
  setup: (build) => {
    const rm = () => {
      dirs.forEach((dir) => {
        if (existsSync(dir)) {
          rmSync(dir, { force: true, recursive: true });
        }
      });

      console.log(`Deleted ${dirs} during ${when}`);
    };

    if (when === 'start') {
      build.onStart(rm);
    } else if (when === 'end') {
      build.onEnd(rm);
    }
  },
});
