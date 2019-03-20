import TaroBox from './prng.js';
import fs from 'fs';

test();

function test() {
  const tb = new TaroBox();

  const SIZE = 1000000;

  const buf = new Buffer(SIZE);

  for( let i = 0; i < SIZE; i++ ) {
    buf[i] = tb.random();
  }

  fs.writeFileSync('xyz', buf);
}
