/**
 * Enhanced compress plugin
 * https://github.com/LinbuduLab/esbuild-plugins/tree/main/packages/esbuild-plugin-compress
 */

/**
 * @typedef {import('zlib').BrotliOptions} BrotliOptions
 * @typedef {import('zlib').ZlibOptions} ZlibOptions
 * @typedef {import('esbuild').Plugin} Plugin
 * @typedef {import('./write-compress').CompressOptions} CompressOptions
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import picomatch from 'picomatch';
import { brotliCompressSync, gzipSync } from 'zlib';
import { log, murmurhash3_32_gc } from '../util/index.js';

/**
 * @param {string} path
 * @param {Uint8Array} contents
 */
const writeOriginFiles = (path, contents) => {
  writeFileSync(path, contents);
};

/**
 * @param {string} path
 * @param {Uint8Array} contents
 * @param {ZlibOptions} options
 */
const writeGzipCompress = (path, contents, options = { level: 6 /* 1-9 */ }) => {
  const gzipped = gzipSync(contents, options);
  writeFileSync(`${path}.gz`, gzipped);
};

/**
 * @param {string} path
 * @param {Uint8Array} contents
 * @param {BrotliOptions} options
 */
const writeBrotliCompress = (
  path,
  contents,
  options = {
    params: {
      BROTLI_PARAM_QUALITY: 6 /* 0-11 */,
    },
  },
) => {
  const gzipped = brotliCompressSync(contents, options);
  writeFileSync(`${path}.br`, gzipped);
};

/**
 * @param {Pick<CompressOptions, 'gzip' | 'gzipOptions' | 'brotli' | 'brotliOptions'> & {
 *   originPath: string;
 *   contents: Uint8Array;
 * }} options - Compression options and the file to compress.
 * @returns {Plugin} An esbuild plugin for compression.
 */
const writeCompressed = ({ gzip, gzipOptions, brotli, brotliOptions, originPath, contents }) => {
  mkdirSync(path.dirname(originPath), { recursive: true });

  if (gzip) writeGzipCompress(originPath, contents, gzipOptions);
  if (brotli) writeBrotliCompress(originPath, contents, brotliOptions);
};

// --------------------------------------------------

/**
 * CAUTION ; no rotation cache map.
 * Stores path:file_content_hash entries thus shouldn't cause memory problems even over time.
 */
const cache = {};

/**
 * @param {CompressOptions} options - Compression options
 */
export const writeCompress = ({
  gzip = true,
  gzipOptions = {},
  brotli = true,
  brotliOptions = {},
  exclude = [],
  emitOrigin = true,
  externalTargets = [],
  excludeExternal = [],
  emitExternalOrigin = false,
}) => {
  return {
    name: 'plugin-write-compress',
    setup({ initialOptions: { write }, onEnd }) {
      if (write === true) {
        log('error', 'Set write option as false to use compress plugin.');
        return;
      }

      const shouldCompress = gzip || brotli;

      onEnd(async ({ outputFiles }) => {
        log('warn', 'Compressing...');

        for (const { path: originPath, contents } of outputFiles || []) {
          if (!contents?.length) continue;

          const shouldExclude = picomatch.isMatch(originPath, exclude);
          if (shouldExclude && !emitOrigin) continue;

          const cwd = process.cwd();
          const relativePath = path.relative(cwd, originPath);

          const hashed = murmurhash3_32_gc(contents, 0);
          if (cache[originPath] === hashed) {
            log('info', `[Cached] Skip processing internal file: ${relativePath}`);
            continue;
          }
          cache[originPath] = hashed;

          if (!shouldExclude && shouldCompress) {
            log('info', `Compressing and writing internal file: ${relativePath}`);
            writeCompressed({
              gzip,
              gzipOptions,
              brotli,
              brotliOptions,
              originPath,
              contents,
            });
          }

          if ((!shouldExclude && emitOrigin) || emitOrigin === 'force') {
            log('info', `Writing origin file: ${relativePath}`);
            writeOriginFiles(originPath, contents);
          }
        }

        for (const originPath of externalTargets) {
          const shouldExclude = picomatch.isMatch(originPath, excludeExternal);
          if (shouldExclude && !emitOrigin) continue;
          if (!existsSync(originPath)) continue;

          const contents = readFileSync(originPath);
          if (!contents?.length) continue;

          const cwd = process.cwd();
          const relativePath = path.relative(cwd, originPath);

          const hashed = murmurhash3_32_gc(contents, 0);
          if (cache[originPath] === hashed) {
            log('info', `[Cached] Skip processing external file: ${relativePath}`);
            continue;
          }
          cache[originPath] = hashed;

          if (!shouldExclude && shouldCompress) {
            log('info', `Compressing and writing external file: ${relativePath}`);
            writeCompressed({
              gzip,
              gzipOptions,
              brotli,
              brotliOptions,
              originPath,
              contents,
            });
          }

          if ((!shouldExclude && emitExternalOrigin) || emitExternalOrigin === 'force') {
            log('info', `Writing external origin file: ${relativePath}`);
            writeOriginFiles(originPath, contents);
          }
        }

        log('warn', 'Finished compressing and writing files');
      });
    },
  };
};
