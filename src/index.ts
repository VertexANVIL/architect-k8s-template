import path from 'path';
import { Sequencer } from '@arctarus/architect/src';

async function main() {
  const sequencer = new Sequencer();
  await sequencer.loadFolder(path.join(__dirname, 'targets'));
  await sequencer.run(path.join(__dirname, '../build'));
};

(async () => { await main(); })();
