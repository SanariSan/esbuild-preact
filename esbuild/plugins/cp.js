import { existsSync, cpSync } from 'fs';
import { log } from '../util/index.js';
import path from 'path';

export const cp = (from, to, when = 'end') => ({
  name: `plugin-cp-${when}`,
  setup: (build) => {
    const copy = () => {
      const cwd = process.cwd();

      from.forEach((dir) => {
        const relativePath = path.relative(cwd, dir);

        if (existsSync(dir)) {
          cpSync(dir, to, { recursive: true });
          log('info', `Copied from ${relativePath} to ${to} during ${when}`);
        }
      });

      log('warn', `Copied assets during ${when}`);
    };

    if (when === 'start') {
      build.onStart(copy);
    } else if (when === 'end') {
      build.onEnd(copy);
    }
  },
});
