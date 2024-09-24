import { compile } from 'sass';

// try to find a way to separate .sass and .module.sass with just "filter"
export const sass = () => ({
  name: 'sass',
  setup: (build) => {
    build.onLoad({ filter: /\.s[ac]ss$/ }, async (args) => ({
      contents: compile(args.path, { sourceMap: true }).css.toString(),
      loader: /\.module\.s[ac]ss$/.test(args.path) ? 'local-css' : 'css',
    }));
  },
});
