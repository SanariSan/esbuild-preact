import { compile } from 'sass';

export const sass = () => ({
  name: 'plugin-sass',
  setup: (build) => {
    build.onLoad({ filter: /\.s[ac]ss$/ }, async (args) => {
      return {
        contents: compile(args.path, {
          sourceMap: process.env.ESBUILD_SASS_SOURCE_MAP === 'true',
        }).css.toString(),
        loader: /\.module\.s[ac]ss$/.test(args.path) ? 'local-css' : 'css',
      };
    });
  },
});

// todo: try to find a way to separate .sass and .module.sass
// with just "filter" for faster processing
