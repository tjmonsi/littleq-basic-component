import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import fs from 'fs';
const output = [];
const ignoreFiles = ['.eslintrc.js', 'rollup.config.js'];
const testCaseFiles = fs.readdirSync('test/unit/cases');
const nameComponent = 'LittleqBasicComponent';
const files = fs.readdirSync(__dirname)
  .filter(file => {
    const fileArray = file.split('.');
    return fileArray[fileArray.length - 1] === 'js' && ignoreFiles.indexOf(file) < 0;
  })
  .map(file => file.replace(/\.js$/g, ''));

const outputUMDPush = (input, file, name, es5, minify) => {
  const plugins = [
    resolve(), // so Rollup can find `ms`
    commonjs() // so Rollup can convert `ms` to an ES module
  ];
  if (es5) {
    plugins.push(babel());
  }
  if (minify) {
    plugins.push(uglify());
  }
  output.push({
    input,
    plugins,
    output: {
      file,
      name,
      format: 'umd'
    }
  });
};

const outputCJSESPush = (input, name, es5) => {
  const plugins = [];
  if (es5) {
    plugins.push(babel());
  }
  output.push({
    input,
    plugins,
    external: ['ms'],
    output: [
      { file: `dist/${name}.cjs${es5 ? '.es5' : ''}.js`, format: 'cjs' },
      { file: `dist/${name}.esm${es5 ? '.es5' : ''}.js`, format: 'es' }
    ]
  });
};

for (let testFile of testCaseFiles) {
  outputUMDPush(`test/unit/cases/${testFile}`, `test/unit/cases-es5/${testFile}`, 'TestElements', true);
}

for (let name of files) {
  let input = `${name}.js`;
  outputUMDPush(input, `dist/${name}.umd.js`, nameComponent);
  outputUMDPush(input, `dist/${name}.umd.min.js`, nameComponent, false, true);
  outputUMDPush(input, `dist/${name}.umd.es5.js`, nameComponent, true);
  outputUMDPush(input, `dist/${name}.umd.es5.min.js`, nameComponent, true, true);
  outputCJSESPush(input, name);
  outputCJSESPush(input, name, true);
}

export default output;
