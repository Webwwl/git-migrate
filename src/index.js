#!/usr/bin/env node
const shelljs = require('shelljs')
const program = require('commander')
const chalk = require('chalk')

// resolve argvs
program.version('1.0.5')
.option('-s, --source <vlaue>', 'source remote')
.option('-t, --target <vlaue>', 'target remote')
.option('-ral, --removeAllLocalBranches', 'remove all local branchs except master ')
.option('-rrb, --removeRemoteBranches <value>', 'remove remote branches except master ')
.option('-m, --master', 'push master to target ')
.parse(process.argv)

const source = program.source
const target = program.target
const removeAllLocalBranches = program.removeAllLocalBranches
const removeRemoteBranches = program.removeRemoteBranches
const master = program.master

// remove all localBranches
if(removeAllLocalBranches) {
  shelljs.exec('git checkout master');
  const branches = getAllLocalBranches();
  branches.forEach(branch => {
    shelljs.exec(`git branch -D ${branch}`, {silent: true});
    console.log(chalk.red(`delete branch: ${branch}`))
  })
  shelljs.exit(0)
}

// remove remote branches
if(removeRemoteBranches) {
  shelljs.exec('git checkout master');
  const remoteBranches = getRemoteBranches(removeRemoteBranches);
  remoteBranches.forEach(branch => {
    shelljs.exec(`git push ${removeRemoteBranches} :${branch}`);
    console.log(chalk.red(`delete branch: ${branch}`))
  })
  shelljs.exit(0);
}

// migrate 
console.log(chalk.green(`source: ${source}, target: ${target}`))
// get all branchs 
const branchs = shelljs.exec(`git branch -a | grep ${source}`, {silent: true})
.stdout.split('\n')
.map(branch => branch.replace('*', '').replace(/\s*/, ''))
.filter(branch => (branch !== '' && !branch.includes('master') && !branch.toLowerCase().includes('head')));

for(let i = 0, l = branchs.length; i < l; i++) {
  const fullbranch = branchs[i];
  const branch = fullbranch.split('/').slice(-1);
  console.log(chalk.green(`now in ${branch}, start push...`));
  pushTarget(fullbranch, branch, target);
  console.log(chalk.green(`push branch: ${branch} over`));
}
// if push master
if(master) {
  console.log(chalk.green(`now in master, start push...`));
  shelljs.exec(`git push ${target} master:master`);
  console.log(chalk.green(`push branch: master over`));
}

console.log(chalk.green(`pushed all branch, total: ${branchs.length}, from ${source} to ${target}`));

// get a remote's branches except master
function getRemoteBranches(target) {
  return shelljs.exec(`git branch -a | grep ${target}`, {silent: true})
        .stdout.split('\n')
        .filter(branch => (branch && !branch.includes('master') && !branch.toLowerCase().includes('head')))
        .map(branch => branch.replace('*', '').replace(/\s*/g, '').split('/').slice(-1));
}

// get all local branches except master
function getAllLocalBranches() {
  return shelljs.exec('git branch', {silent: true})
        .stdout.split('\n')
        .map(branch => branch.replace('*', '').replace(/\s*/g, ''))
        .filter(branch => (branch !== '' && !branch.includes('master') && !branch.toLowerCase().includes('head')));
}

// push local branch to remote 
function pushTarget(fullbranch, branch, target) {
  console.log(`fullbranch: ${fullbranch} branch: ${branch}`)
  shelljs.exec(`git checkout -t ${fullbranch}`);
  shelljs.exec(`git push ${target} ${branch}:${branch}`);
}