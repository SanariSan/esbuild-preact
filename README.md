TODO:

- Replace `compress` with just its core functionality to avoid unnecessary deps
- Think about compressing `index.html` as now it is just copied to `/dist`
- Add `--start` live reload

Currently running with:

```sh
yarn build && http-server dist -p 4000 --gzip --brotli
```