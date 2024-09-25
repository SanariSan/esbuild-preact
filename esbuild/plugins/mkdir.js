import { mkdirSync, existsSync } from 'fs';

export const mkdir = (dirs, when = 'start') => ({
  name: `mkdir-${when}`,
  setup: (build) => {
    const makeDirs = () => {
      dirs.forEach((dir) => {
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }
      });

      console.log(`Created ${dirs} during ${when}`);
    };

    if (when === 'start') {
      build.onStart(makeDirs);
    } else if (when === 'end') {
      build.onEnd(makeDirs);
    }
  },
});
