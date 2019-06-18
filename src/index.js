#!/usr/bin/env node
const shelljs = require('shelljs')
const program = require('commander')
const chalk = require('chalk')

// resolve argvs
program.version('1.0.0')
.option('-s, --source <vlaue>', 'source remote')
.option('-t, --target <vlaue>', 'target remote')
.parse(process.argv)

const source = program.source
const target = program.target

console.log(chalk.green(`source: ${source}, target: ${target}`))
// get all branchs 
const branchs = shelljs.exec(`git branch -a | grep ${source}`, {silent: true})
.stdout.split('\n')
.map( branch => branch.replace('*', '').replace(/\s*/, ''))
.filter(branch => (branch !== '' && !branch.includes('master')));

function pushTarget(fullbranch, branch, target) {
  console.log(`fullbranch: ${fullbranch} branch: ${branch}`)
  shelljs.exec(`git checout -t ${fullbranch}`, {silent: true});
  shelljs.exec(`git push ${target} branch:branch`, {silent: true});
}

for(let i = 0, l = branchs.length; i < l; i++) {
  const fullbranch = branchs[i];
  const branch = fullbranch.split('/').slice(-1);
  console.log(chalk.green(`now in ${branch}, start push...`));
  pushTarget(fullbranch, branch, target);
  console.log(chalk.green(`push branch: ${branch} over`));
}

console.log(chalk.green(`pushed all branch, total: ${branchs.length}, from ${source} to ${target}`));