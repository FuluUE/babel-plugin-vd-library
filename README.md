# babel-plugin-vd-library

A simple transform to cherry-pick VD library modules so you don’t have to.

## Install

```shell
$ npm i --save-dev babel-plugin-vd-library babel-cli babel-preset-env
```

## Example

Transforms
```js
import _ from 'fl';

_.map([1, 2, 3]);
```

roughly to
```js
import _map from 'fl/map';

_map([1, 2, 3]);
```

## Usage

###### .babelrc

Set plugin options using an array of `[pluginName, optionsObject]`.
```json
{
  "plugins": [["vd-library", { "library": ["fl"] }]],
  "presets": [["env", { "targets": { "node": 4 } }]]
}
```

