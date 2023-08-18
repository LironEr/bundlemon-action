import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { context } from '@actions/github';

async function run(): Promise<void> {
  try {
    setEnvVars();

    await runCli();
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

function setEnvVars() {
  core.info('set environment vars for BundleMon cli');

  const { payload } = context;
  const pr = payload.pull_request;

  const commitSha = pr?.head?.sha || context.sha;
  const commitMsg = context.payload.head_commit?.message || '';

  if (commitSha) {
    core.info('set env variable : CI_COMMIT_SHA');
    core.exportVariable('CI_COMMIT_SHA', commitSha);
  }

  if (commitMsg) {
    core.info('set env variable : CI_COMMIT_MESSAGE');
    core.exportVariable('CI_COMMIT_MESSAGE', commitMsg);
  }
}

function parseArgs(input: string) {
  if (!input) {
    return [];
  }

  const regex = new RegExp('"[^"]+"|[\\S]+', 'g');
  const args: string[] = [];

  input.match(regex)?.forEach((element: string) => {
    if (!element) return;
    return args.push(element.replace(/"/g, ''));
  });

  return args;
}

function getBundlemonBin() {
  const version = core.getInput('bundlemon-version');
  return 'bundlemon'.concat(version ? `@${version}` : '');
}

async function runCli() {
  const workingDirectory = core.getInput('working-directory');
  const bundlemonArgs = parseArgs(core.getInput('bundlemon-args'));

  const options: exec.ExecOptions = {
    listeners: {
      stdout: (data) => {
        core.info(data.toString());
      },
      stderr: (data) => {
        core.info(data.toString());
      },
    },
  };

  if (workingDirectory) {
    options.cwd = workingDirectory;
  }

  const args = [getBundlemonBin(), ...bundlemonArgs];

  await exec.exec('npx', args, options);
}

run();
