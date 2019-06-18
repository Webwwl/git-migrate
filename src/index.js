const shelljs = require('shelljs')

const branchs = shelljs.exec('git branch', {silent: true}).stdout;
console.log('branch:', branchs)