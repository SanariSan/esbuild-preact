# Esbuild-Preact

## Bare minimum modern frontend setup. Not a library or solution, just a starter template for myself, as I've grown tired of the `node_modules` black hole being 100 times larger than the entire project codebase.

- Preact (1:1 React experience with smaller bundle)
- SASS
- Esbuild (Blazingly fast bundling/re-building)
- Compatibility defaults from Vite and no Babel used - `'es6', 'chrome87', 'firefox78', 'safari14', 'edge88'`
- Gzip/Brotli/Both output encoding
- Built-in chunking (at least in the js department, though I'm not sure about CSS)
- Re-build simple caching to cut time even further
- Env vars substitution
- Live reload and partial Hot Module Replacement (CSS only)
- Linter (not a heavy eslint)
- Prettier
- Tested with chakra-ui to ensure react backwards compatibility (lib not included)

To use with `React`:
- Add `react`, `react-dom`
- Remove aliasing in `esbuild.config.js`
- Remove preact paths, `jsxFactory`, `jsxFragmentFactory` and `jsxImportSource` in `tsconfig.json`

Build time:
- Gzip, No chakra ; yarn build -> `270ms` ; actual build -> `57ms`

<img src="https://github.com/SanariSan/esbuild-preact/blob/master/etc/1.png?raw=true" width="440" height="18">

- Gzip, With chakra ; yarn build -> `340ms`

Rebuild time:
- Gzip, No chakra ; initial yarn build -> `270ms` ; changes -> `15ms`

<img src="https://github.com/SanariSan/esbuild-preact/blob/master/etc/2.png?raw=true" width="440" height="18">

And it could be even lower with optimizations, but with such absurdly low metrics, there's just no point.

#### All of that fits into `82.9 MiB` of `node_modules` space, including dev dependencies. <img src="https://static-cdn.jtvnw.net/emoticons/v2/305253890/default/light/2.0" width=24 height=24 />

#### These are the bare minimum dependencies used:

```js
"dependencies": {
  "preact": "^10.22.1",
  "preact-iso": "^2.6.3",
  "preact-render-to-string": "^6.4.0"
},
"devDependencies": {
  "@types/node": "^22.5.1",
  "esbuild": "^0.24.0",
  "picomatch": "^4.0.2",
  "prettier": "^2.7.1",
  "quick-lint-js": "^3.2.0",
  "sass": "^1.79.3",
  "typescript": "<=5.2.0"
}
```

I haven't compared the output bundle size with other build tools yet since the codebase is too small to draw any real conclusions, but I'll probably add that in later.

It's worth mentioning that I had to write some custom build-related code to get esbuild to handle what seemed like trivial tasks at first glance—things I was used to getting out of the box from CRA, Vite, and Webpack. Esbuild was missing essential parts here and there, and there aren’t many well-written and optimized plugins to fill the gaps. Moreover, I wanted to include as few dependencies as possible. So, I had to dig through what's available and piece together a 'regular' web development environment step by step. It was fun, and more importantly, an insightful experience as I learned things I never would have with all those pre-built tools.

Esbuild isn't 'production-ready' in the sense that it frequently ships breaking changes. However, it's highly agile with its custom plugin feature. You need to be prepared to get your hands dirty in exchange for fast build speeds and a somewhat immature ecosystem. For me, it's been worth it, and I hope to extract even more value over time.

Also shoutouts to [tsoding](https://github.com/tsoding) and his [React exploration video](https://www.youtube.com/watch?v=XAGCULPO_DE) for making me rethink how bad it all is in webdev land.

### Usage:

```sh
yarn start
yarn build
```