import { mkdirSync, existsSync } from 'fs';
import { log } from '../util/index.js';
import path from 'path';

export const mkdir = (dirs, when = 'start') => ({
  name: `plugin-mkdir-${when}`,
  setup: (build) => {
    const makeDirs = () => {
      const cwd = process.cwd();

      dirs.forEach((dir) => {
        const relativePath = path.relative(cwd, dir);

        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
          log('info', `Created dir ${relativePath} during ${when}`);
        }
      });

      log('warn', `Created dirs during ${when}`);
    };

    if (when === 'start') {
      build.onStart(makeDirs);
    } else if (when === 'end') {
      build.onEnd(makeDirs);
    }
  },
});
