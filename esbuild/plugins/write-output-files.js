import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { log } from '../util/index.js';

// just write the output files
export const writeOutputFiles = () => ({
  name: 'plugin-write',
  setup: (build) => {
    build.onEnd(async (ctx) => {
      const cwd = process.cwd();

      for (const { path: outputPath, contents } of ctx.outputFiles) {
        if (!contents?.length) return;

        const dirname = path.dirname(outputPath);
        const relativePath = path.relative(cwd, outputPath);

        if (!existsSync(dirname)) {
          mkdirSync(dirname, { recursive: true });
          log('info', `Created missing dir ${relativePath}`);
        }

        writeFileSync(outputPath, contents);
        log('info', `Wrote entity ${relativePath}`);
      }

      log('warn', 'Wrote all internal output files');
    });
  },
});
