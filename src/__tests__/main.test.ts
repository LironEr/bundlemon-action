import * as process from 'node:process';
import * as cp from 'node:child_process';
import * as path from 'node:path';
import { describe, test, expect } from '@jest/globals';

const execCommand = async (
  command: string,
  args: string[],
  options: cp.ExecFileOptions,
): Promise<{ stdout: string; stderr: string; code: number | null }> => {
  return new Promise((resolve) => {
    const childProcess = cp.spawn(command, args, options);

    let stdout = '';
    childProcess.stdout!.on('data', (data) => {
      stdout = stdout + data.toString();
    });

    let stderr = '';
    childProcess.stderr!.on('data', (data) => {
      stderr = stderr + data.toString();
    });

    childProcess.on('close', (code) => {
      resolve({ stdout, stderr, code });
    });

    childProcess.on('error', (err) => {
      console.log('err:', err);
    });
  });
};

const MAIN_ACTION_FILE = path.join(__dirname, '..', '..', 'lib', 'main.js');

describe('action', () => {
  test('config file not found', async () => {
    const extraEnv = {
      'INPUT_BUNDLEMON-ARGS': '--config not-found.json',
    };

    const { code, stdout } = await execCommand(process.execPath, [MAIN_ACTION_FILE], {
      env: { ...process.env, ...extraEnv },
    });

    expect(code).toBe(1);
    expect(stdout).toContain('no such file or directory');
  });

  test('validate bundlemon-version', async () => {
    const extraEnv = {
      'INPUT_BUNDLEMON-ARGS': '--version',
      'INPUT_BUNDLEMON-VERSION': '2.0.0',
    };

    const { code, stdout } = await execCommand(process.execPath, [MAIN_ACTION_FILE], {
      env: { ...process.env, ...extraEnv },
    });

    expect(code).toBe(0);
    expect(stdout).toContain('2.0.0');
  });
});
