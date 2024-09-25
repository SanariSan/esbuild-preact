import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

export const injectHtmlAssets = (
  sourceHtmlPath = './public/index.html',
  outputHtmlPath = './dist/index.html',
) => ({
  name: 'inject-html-assets',
  setup: (build) => {
    build.onEnd((result) => {
      let scriptTags = '';
      let linkTags = '';

      for (let i = 0; i < result.outputFiles.length; i += 1) {
        const file = result.outputFiles[i];
        const basename = path.basename(file.path);

        if (basename.endsWith('.js')) {
          console.log(`Injecting JS asset: ${basename}`);
          scriptTags += `<script type="module" src="./${basename}"></script>\n`;
        } else if (basename.endsWith('.css')) {
          console.log(`Injecting CSS asset: ${basename}`);
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

      console.log(`Injected JS and CSS assets into HTML`);
    });
  },
});
