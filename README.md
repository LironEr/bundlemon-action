<div align="center">
  <a href="https://github.com/LironEr/bundlemon"><img src="https://github.com/LironEr/bundlemon/raw/master/assets/bundlemon-optimized.svg" alt="BundleMon logo" width="150px" height="150px" /></a>
</div>

# BundleMon GitHub Action

Easily use [BundleMon](https://github.com/LironEr/bundlemon) to monitor your bundle size on every commit from GitHub Actions

## Inputs

| Name              | Required | Default        | Description                                                        |
| ----------------- | :------: | -------------- | ------------------------------------------------------------------ |
| bundlemon-args    |    -     |                | Optional args for [BundleMon cli](https://github.com/LironEr/bundlemon#cli-usage). Example: --subProject "some-name" |
| bundlemon-version |    -     | Latest version | BundleMon cli version                                              |
| working-directory |    -     |                | The working directory                                              |

## Usage

BundleMon config must be present to run this action, See [BundleMon setup](https://github.com/LironEr/bundlemon#setup) for more info.

```yaml
name: Build

on:
  push:
    branches: [main]
  pull_request:
    types: [synchronize, opened, reopened]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: yarn

      - name: Build
        run: yarn build

      - name: BundleMon
        uses: lironer/bundlemon-action@v1
```

### Example run BundleMon on multiple projects

```yaml
name: Build

on:
  push:
    branches: [main]
  pull_request:
    types: [synchronize, opened, reopened]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: yarn

      - name: Build
        run: yarn build

      - name: BundleMon Project A
        uses: lironer/bundlemon-action@v1
        with:
          bundlemon-args: --config project-a-config.json --subProject "project-a"

      - name: BundleMon Project B
        uses: lironer/bundlemon-action@v1
        with:
          bundlemon-args: --config project-b-config.json --subProject "project-b"
```
