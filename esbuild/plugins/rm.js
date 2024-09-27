import { rmSync, existsSync } from 'fs';
import { log } from '../util/index.js';
import path from 'path';

export const rm = (dirs, when = 'end') => ({
  name: `plugin-rm-${when}`,
  setup: (build) => {
    const rm = () => {
      const cwd = process.cwd();

      dirs.forEach((dir) => {
        const relativePath = path.relative(cwd, dir);

        if (existsSync(dir)) {
          rmSync(dir, { force: true, recursive: true });
          log('info', `Deleted ${relativePath} during ${when}`);
        }
      });

      log('warn', `Deleted dirs during ${when}`);
    };

    if (when === 'start') {
      build.onStart(rm);
    } else if (when === 'end') {
      build.onEnd(rm);
    }
  },
});
