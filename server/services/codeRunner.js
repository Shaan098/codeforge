import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

const execFileAsync = promisify(execFile);

export async function runCodeInSandbox(code, language, input, timeoutMs = 5000) {
  const tmpDir = path.join(process.cwd(), 'server', 'tmp_sandbox');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const id = uuidv4();
  let file = '';
  let command = '';
  let args = [];

  if (language === 'javascript') {
    file = path.join(tmpDir, `${id}.js`);
    fs.writeFileSync(file, `const _input = ${JSON.stringify(input)};\nconst lines = _input.trim().split('\\n');\n${code}\n`);
    command = 'node';
    args = [file];
  } else if (language === 'python') {
    file = path.join(tmpDir, `${id}.py`);
    fs.writeFileSync(file, `import sys\n_input = ${JSON.stringify(input)}\nlines = _input.strip().split('\\n')\n${code}\n`);
    command = process.platform === 'win32' ? 'python' : 'python3';
    args = [file];
  } else {
    return {
      stdout: '',
      stderr: 'Compilation simulation only - no native compiler in sandbox.',
      exitCode: 0,
    };
  }

  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      timeout: timeoutMs,
      maxBuffer: 1024 * 1024,
    });

    return { stdout: stdout.trim(), stderr: stderr.trim(), exitCode: 0 };
  } catch (error) {
    return {
      stdout: error.stdout?.trim() || '',
      stderr: error.stderr?.trim() || error.message,
      exitCode: error.code || 1,
    };
  } finally {
    if (file && fs.existsSync(file)) fs.unlinkSync(file);
  }
}
