import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export async function askLine(prompt: string): Promise<string> {
  const rl = readline.createInterface({ input, output });
  const ans = await rl.question(prompt);
  rl.close();
  return ans.trim();
}

export async function askChoiceOrCommand(max:number): Promise<{kind:'choice', n:number} | {kind:'cmd', cmd:string, arg?:string}> {
  // This is intentionally an infinite loop for user input; break only on valid input.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const ans = await askLine('Pick a choice number, or :s(ave) / :l(oad) / :q(uit): ');
    // command?
    if (ans.startsWith(':')) {
      const parts = ans.slice(1).split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ') || undefined;
      if (['s','save','l','load','q','quit'].includes(cmd)) {
        return { kind:'cmd', cmd, arg };
      }
      console.log('Unknown command. Use :s, :l, or :q');
      continue;
    }
    const n = parseInt(ans,10);
    if (!Number.isNaN(n) && n>=1 && n<=max) return { kind:'choice', n };
    console.log('Enter a number between 1 and '+max+', or a command.');
  }
}
