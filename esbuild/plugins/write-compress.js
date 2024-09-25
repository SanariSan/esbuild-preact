/**
 * Modified compress plugin
 * https://github.com/LinbuduLab/esbuild-plugins/tree/main/packages/esbuild-plugin-compress
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import picomatch from 'picomatch';
import { brotliCompressSync, gzipSync } from 'zlib';
import { murmurhash3_32_gc } from '../util/index.js';

/**
 * @typedef {import('zlib').BrotliOptions} BrotliOptions
 * @typedef {import('zlib').ZlibOptions} ZlibOptions
 * @typedef {import('esbuild').Plugin} Plugin
 * @typedef {import('./write-compress').CompressOptions} CompressOptions
 */

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

// caution, no rotation
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
        console.log('Set write option as false to use compress plugin.');
        return;
      }

      const shouldCompress = gzip || brotli;

      onEnd(async ({ outputFiles }) => {
        for (const { path: originPath, contents } of outputFiles || []) {
          if (!contents?.length) continue;

          const shouldExclude = picomatch.isMatch(originPath, exclude);
          if (shouldExclude && !emitOrigin) continue;

          const hashed = murmurhash3_32_gc(contents, 0);
          if (cache[originPath] === hashed) {
            console.log(`[Cached] Skip processing internal file: ${originPath}`);
            continue;
          }
          cache[originPath] = hashed;

          if (!shouldExclude && shouldCompress) {
            console.log(`Compressing and writing internal file: ${originPath}`);
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
            console.log(`Writing origin file: ${originPath}`);
            writeOriginFiles(originPath, contents);
          }
        }

        for (const originPath of externalTargets) {
          const shouldExclude = picomatch.isMatch(originPath, excludeExternal);
          if (shouldExclude && !emitOrigin) continue;
          if (!existsSync(originPath)) continue;

          const contents = readFileSync(originPath);
          if (!contents?.length) continue;

          const hashed = murmurhash3_32_gc(contents, 0);
          if (cache[originPath] === hashed) {
            console.log(`[Cached] Skip processing external file: ${originPath}`);
            continue;
          }
          cache[originPath] = hashed;

          if (!shouldExclude && shouldCompress) {
            console.log(`Compressing and writing external file: ${originPath}`);
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
            console.log(`Writing external origin file: ${originPath}`);
            writeOriginFiles(originPath, contents);
          }
        }
      });
    },
  };
};
