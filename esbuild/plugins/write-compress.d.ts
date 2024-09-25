import type { Plugin } from 'esbuild';
import type { BrotliOptions, ZlibOptions } from 'zlib';

export interface CompressOptions {
  /**
   * enable gzip compress
   * @default true
   */
  gzip?: boolean;

  /**
   * gzip compress options passed to zlib.gzipSync
   */
  gzipOptions?: ZlibOptions;

  /**
   * enable brotli compress
   * @default true
   */
  brotli?: boolean;

  /**
   * brotli compress options passed to zlib.brotliCompressSync
   */
  brotliOptions?: BrotliOptions;

  /**
   * should write origin file
   * 'force' will ignore exclude compression filter
   * @default true
   */
  emitOrigin?: boolean | 'force';

  /**
   * exclude files from compression
   * uses picomatch.isMatch(outputPath, excludePatterns)
   * @default []
   */
  exclude?: string[];

  /**
   * external targets to compress and emit
   * @default []
   */
  externalTargets?: string[];

  /**
   * should emit external origin files
   * 'force' will ignore excludeExternal compression filter
   * @default false
   */
  emitExternalOrigin?: boolean | 'force';

  /**
   * exclude external files from compression
   * uses picomatch.isMatch(outputPath, excludePatterns)
   * @default []
   */
  excludeExternal?: string[];
}

declare function writeCompress(options: CompressOptions): Plugin;
