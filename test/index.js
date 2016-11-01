/* global describe */
const path   = require('path');
const fs     = require('fs');
const assert = require('assert');
const babel  = require('babel-core');
const plugin = require('../src/index').default;

const UPDATE = !!process.env.UPDATE;

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

const fixturesDir = path.join(__dirname, '../src/__test__/fixtures');
const INPUT_POSTFIX = '.input.js';
const OUTPUT_POSTFIX = '.output.js';

describe('emit asserts for: ', () => {
  fs.readdirSync(fixturesDir)
    .filter(caseName => caseName.indexOf(INPUT_POSTFIX) !== -1)
    .map(caseName => {
      it(caseName, () => {
        const name = caseName.substr(0, caseName.length - INPUT_POSTFIX.length);
        const actual = babel.transformFileSync(
          path.join(fixturesDir, name + INPUT_POSTFIX), {
            babelrc: false,
            presets: ['es2015', 'stage-1', 'react'],
            plugins: [
              'syntax-flow',
              plugin
            ]
          }
        ).code;
        let expected;
        try {
          expected = fs.readFileSync(path.join(fixturesDir, name + OUTPUT_POSTFIX)).toString();
          if (expected.trim() !== actual.trim() && UPDATE) {
            console.error('Updating for fixture ' + name);
            console.error(actual);
            throw new Error('just to skip to the catch');
          }
        }
        catch (e) {
          expected = actual;
          fs.writeFileSync(path.join(fixturesDir, name + OUTPUT_POSTFIX), actual);
        }

        assert.equal(trim(actual), trim(expected));
      });
    });
});
