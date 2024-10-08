/**
 * Redirect undesired imports to custom paths
 * https://www.npmjs.com/package/esbuild-plugin-alias
 */

/**
 * @typedef {import('esbuild').Plugin} Plugin
 */

/**
 * @param {Record<string, string>} options - alias to path map.
 * @returns {import('esbuild').Plugin}
 *
 * @example
 * { react: path.resolve('./node_modules/preact/compat/dist/compat.js') }
 */
export const alias = (options) => {
  const aliases = Object.keys(options);
  const re = new RegExp(`^(${aliases.map((x) => escapeRegExp(x)).join('|')})$`);

  return {
    name: 'plugin-alias',
    setup(build) {
      // we do not register 'file' namespace here, because the root file won't be processed
      // https://github.com/evanw/esbuild/issues/791
      build.onResolve({ filter: re }, (args) => {
        // console.log(`Alias: ${args.path} -> ${options[args.path]}`);
        return {
          path: options[args.path],
        };
      });
    },
  };
};

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#escaping
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_the_replacement
 */
const escapeRegExp = (string) => {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
