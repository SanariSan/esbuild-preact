import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

// slow and sync, debug purpose
export const writeOutputFiles = () => ({
  name: 'write-output-files',
  setup: (build) => {
    build.onEnd(async (ctx) => {
      // console.dir(ctx, { depth: null });

      for (const { path: outputPath, contents } of ctx.outputFiles) {
        if (!contents?.length) return;

        if (!existsSync(path.dirname(outputPath))) {
          mkdirSync(path.dirname(outputPath), { recursive: true });
        }

        writeFileSync(outputPath, contents);
      }
    });
  },
});
