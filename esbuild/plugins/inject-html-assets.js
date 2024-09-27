import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { log } from '../util/index.js';

export const injectHtmlAssets = (
  sourceHtmlPath = './public/index.html',
  outputHtmlPath = './dist/index.html',
) => ({
  name: 'plugin-inject-html-assets',
  setup: (build) => {
    build.onEnd((result) => {
      let scriptTags = '';
      let linkTags = '';

      for (let i = 0; i < result.outputFiles.length; i += 1) {
        const file = result.outputFiles[i];
        const basename = path.basename(file.path);
        const relativePath = path.relative(process.cwd(), file.path);

        if (relativePath.endsWith('.js')) {
          log('info', `Injecting JS asset: ${relativePath}`);
          scriptTags += `<script type="module" src="./${basename}"></script>\n`;
        } else if (relativePath.endsWith('.css')) {
          log('info', `Injecting CSS asset: ${relativePath}`);
          linkTags += `<link rel="stylesheet" href="./${basename}">\n`;
        }
      }

      let htmlContent = readFileSync(sourceHtmlPath, 'utf8');

      if (scriptTags) {
        htmlContent = htmlContent.replace('</body>', `${scriptTags}</body>`);
      }

      if (linkTags) {
        htmlContent = htmlContent.replace('</head>', `${linkTags}</head>`);
      }

      writeFileSync(outputHtmlPath, htmlContent, {
        encoding: 'utf8',
        flag: 'w',
      });

      log('warn', `Injected JS and CSS assets into HTML`);
    });
  },
});
