import esbuild from 'esbuild';
import { compress } from 'esbuild-plugin-compress';
import { cp, rm, injectHtmlAssets, sass } from './esbuild/index.js';

const staticExt = [
  '.png',
  '.svg',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.woff',
  '.woff2',
  '.eot',
  '.ttf',
  '.otf',
  '.webm',
  '.ico',
];
const codeAssetsLoaders = Object.fromEntries(staticExt.map((ext) => [ext, 'file']));
const staticAssetsLoaders = Object.fromEntries(staticExt.map((ext) => [ext, 'copy']));

if (process.argv.includes('--build')) {
  const result = await esbuild.build({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    write: false, // handling manually
    minify: true,
    sourcemap: false,
    splitting: true,
    outdir: './dist',
    platform: 'browser',
    treeShaking: true,
    format: 'esm',
    keepNames: false,
    // Defaults from Vite: https://vitejs.dev/guide/build#browser-compatibility
    target: ['es6', 'chrome87', 'firefox78', 'safari14', 'edge88'],
    // Defaults from esbuild (except edge16): https://esbuild.github.io/api/#target
    // target: ['chrome58', 'firefox57', 'safari11', 'edge79'],

    jsx: 'automatic',
    loader: codeAssetsLoaders,
    // assetNames: 'assets/[name]-[hash]', https://esbuild.github.io/api/#asset-names
    // chunkNames: 'chunks/[name]-[hash]', https://esbuild.github.io/api/#chunk-names
    // entryNames: '[dir]/[name]-[hash]', https://esbuild.github.io/api/#entry-names
    // publicPath: 'https://www.example.com/v1', https://esbuild.github.io/api/#public-path
    plugins: [
      rm(['./dist'], 'start'),
      cp(['./public/dynamic'], './dist', 'start'), // todo: think about compressing
      sass(),
      injectHtmlAssets('./dist/index.html'),
      compress({
        // todo: just copy core logic and rm from package.json
        brotli: false,
        gzip: true,
      }),
      // writeOutputFiles()
    ],
    logLevel: 'info',
    metafile: true,
  });

  await esbuild.build({
    entryPoints: ['public/static/**/*'],
    outdir: './dist',
    bundle: false,
    write: false, // handled in compress
    loader: staticAssetsLoaders,
    plugins: [
      compress({ brotli: false, gzip: true }),
      // writeOutputFiles()
    ],
  });

  // writeFileSync('meta.json', JSON.stringify(result.metafile));
}

// todo
// if (process.argv.includes('--start')) {
// const ctx = await esbuild.context({
// outfile: 'dist/bundle.js',
// });
// await ctx.watch();
// let { host, port } = await ctx.serve({
//   servedir: 'dist',
//   onRequest: ({ remoteAddress, method, path, status, timeInMS }) => {
//     console.info(remoteAddress, status, `"${method} ${path}" [${timeInMS}ms]`);
//   },
// });
// console.info(`Serving on http://${host}:${port}`);
// }
