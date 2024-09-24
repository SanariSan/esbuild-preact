import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

export const injectHtmlAssets = (htmlFilePath = './dist/index.html') => ({
  name: 'inject-html-assets',
  setup: (build) => {
    build.onEnd((result) => {
      let scriptTags = '';
      let linkTags = '';

      for (let i = 0; i < result.outputFiles.length; i += 1) {
        const file = result.outputFiles[i];

        if (file.path.endsWith('.js')) {
          scriptTags += `<script type="module" src="./${path.basename(file.path)}"></script>\n`;
        } else if (file.path.endsWith('.css')) {
          linkTags += `<link rel="stylesheet" href="./${path.basename(file.path)}">\n`;
        }
      }

      let htmlContent = readFileSync(htmlFilePath, 'utf8');

      if (scriptTags) {
        htmlContent = htmlContent.replace('</body>', `${scriptTags}</body>`);
      }

      if (linkTags) {
        htmlContent = htmlContent.replace('</head>', `${linkTags}</head>`);
      }

      writeFileSync(htmlFilePath, htmlContent, 'utf8');

      console.log(`Injected JS and CSS assets into HTML`);
    });
  },
});
