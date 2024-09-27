import esbuild from 'esbuild';
import {
  cp,
  rm,
  injectHtmlAssets,
  sass,
  writeCompress,
  mkdir,
  alias,
  log,
  buildTracker,
  env,
} from './esbuild/index.js';
import { existsSync, rmSync } from 'fs';
import path from 'path';

// Had to link directly to .js files, docs recommended format did not work
const aliases = {
  react: path.resolve('./node_modules/preact/compat/dist/compat.js'),
  'react/jsx-runtime': path.resolve('./node_modules/preact/compat/jsx-runtime.js'),
  'react-dom': path.resolve('./node_modules/preact/compat/dist/compat.js'),
  'react-dom/*': path.resolve('./node_modules/preact/compat/dist/compat.js'),
};

const assetsLoaders = {
  '.png': 'file',
  '.svg': 'file',
  '.jpg': 'file',
  '.jpeg': 'file',
  '.gif': 'file',
  '.webp': 'file',
  '.woff': 'file',
  '.woff2': 'file',
  '.eot': 'file',
  '.ttf': 'file',
  '.otf': 'file',
  '.webm': 'file',
};

if (process.argv.includes('--build')) {
  await esbuild.build({
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
    jsxDev: false,
    loader: assetsLoaders,
    plugins: [
      buildTracker('start'),
      env(),
      rm(['./dist'], 'start'),
      mkdir(['./dist'], 'start'),
      cp(['./public/static'], './dist', 'start'),
      alias(aliases),
      sass(),
      injectHtmlAssets(),
      writeCompress({
        brotli: false,
        gzip: true,
        emitOrigin: true,
        externalTargets: ['dist/index.html', 'dist/favicon.ico'],
        emitExternalOrigin: false,
      }),
      buildTracker('end'),
    ],
    logLevel: 'warning',
    // metafile: true,
    // assetNames: 'assets/[name]-[hash]', https://esbuild.github.io/api/#asset-names
    // chunkNames: 'chunks/[name]-[hash]', https://esbuild.github.io/api/#chunk-names
    // entryNames: '[dir]/[name]-[hash]', https://esbuild.github.io/api/#entry-names
    // publicPath: 'https://www.example.com/v1', https://esbuild.github.io/api/#public-path
  });

  // writeFileSync('meta.json', JSON.stringify(result.metafile));
}

if (process.argv.includes('--start')) {
  if (existsSync('./dist')) {
    rmSync('./dist', { force: true, recursive: true });
    log('warn', 'Deleted dist folder on init');
  }

  const ctx = await esbuild.context({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    write: false, // handling manually
    minify: false,
    sourcemap: true,
    splitting: false,
    // outdir: './dist',
    outfile: 'dist/bundle.js',
    platform: 'browser',
    treeShaking: true,
    format: 'esm',
    keepNames: true,
    // Defaults from Vite: https://vitejs.dev/guide/build#browser-compatibility
    target: ['es6', 'chrome87', 'firefox78', 'safari14', 'edge88'],
    // Defaults from esbuild (except edge16): https://esbuild.github.io/api/#target
    // target: ['chrome58', 'firefox57', 'safari11', 'edge79'],

    jsx: 'automatic',
    jsxDev: true,
    loader: assetsLoaders,
    plugins: [
      buildTracker('start'),
      env(),
      // no rm() to provide sequential builds using cache map (look writeCompress)
      mkdir(['./dist'], 'start'),
      cp(['./public/static'], './dist', 'start'),
      alias(aliases),
      sass(),
      injectHtmlAssets(),
      writeCompress({
        brotli: false,
        gzip: true,
        exclude: ['**/*.map'],
        emitOrigin: 'force', // exclude from compression, but emit original file
        externalTargets: ['dist/index.html', 'dist/favicon.ico'],
        emitExternalOrigin: false, // because original files are already in final directory
      }),
      buildTracker('end'),
    ],
    logLevel: 'warning',
    // metafile: true,
    // assetNames: 'assets/[name]-[hash]', https://esbuild.github.io/api/#asset-names
    // chunkNames: 'chunks/[name]-[hash]', https://esbuild.github.io/api/#chunk-names
    // entryNames: '[dir]/[name]-[hash]', https://esbuild.github.io/api/#entry-names
    // publicPath: 'https://www.example.com/v1', https://esbuild.github.io/api/#public-path
  });

  await ctx.watch();

  let { host, port } = await ctx.serve({
    servedir: 'dist',
    onRequest: ({ remoteAddress, method, path, status, timeInMS }) => {
      log('info', remoteAddress, status, `"${method} ${path}" [${timeInMS}ms]`);
    },
  });

  console.info(`Serving on http://${host}:${port}`);
}
