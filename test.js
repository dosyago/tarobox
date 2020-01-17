import TaroBox from './tarobox.js';
import fs from 'fs';

test();

function test() {
  const tb = new TaroBox();

  const SIZE = 1000000;

  console.log(`Generating ${SIZE} pseudo-random bytes...`);

  const buf = new Buffer(SIZE);

  for( let i = 0; i < SIZE; i++ ) {
    buf[i] = tb.random();
  }

  console.log(`Writing ${SIZE} bytes...`);

  fs.writeFileSync('output.bin', buf);

  console.log('Done!');
}
