import _ from 'lodash';
import { assert } from 'chai';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import plugin from '../src/index';
import { transformFileSync } from 'babel-core';

function getLodashId(testPath) {
  const postfix = /\b(?:compat|es)\b/.exec(testPath);
  return 'lodash' + (postfix ? '-' + postfix : '');
}

function getTestName(testPath) {
  return path.basename(testPath).split('-').join(' ');
}

/*----------------------------------------------------------------------------*/

describe('cherry-picked modular builds', function () {
  this.timeout(0);

  _.each(glob.sync(path.join(__dirname, 'fixtures/*/')), testPath => {
    const testName = getTestName(testPath);
    const lodashId = getLodashId(testName);
    const actualPath = path.join(testPath, 'actual.js');
    const expectedPath = path.join(testPath, 'expected.js');

    it(`should work with ${testName}`, () => {
      const expected = fs.readFileSync(expectedPath, 'utf8');
      const actual = transformFileSync(actualPath, {
        'plugins': [[plugin, { library: ['fl'] }]]
      }).code;
      fs.writeFileSync('re.txt', _.trim(actual));
      assert.strictEqual(_.trim(actual), _.trim(expected));
    });
  });
});
