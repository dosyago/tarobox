import TaroBox from './tarobox.js';

import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

const out = path.resolve(__dirname, 'out');

if ( ! fs.existsSync(out) ) {
  fs.mkdirSync(out, {recursive:true});
}

//testByte();
//testHalfState();
//testQuarterState();

findBestConfig();

function testByte(tb) {
  tb = tb || new TaroBox();
  console.log(`Testing byte output for ${tb._size}-byte state...`);

  const SIZE = 1000000;

  console.log(`Generating ${SIZE} pseudo-random bytes...`);

  const buf = new Buffer(SIZE);

  for( let i = 0; i < SIZE; i++ ) {
    buf[i] = tb.random();
  }

  console.log(`Writing ${SIZE} bytes...`);

  fs.writeFileSync(path.resolve(out,Date.now()+'.byte.output.bin'), buf);

  console.log("Statistics...");
  const brotli = -((SIZE-zlib.brotliCompressSync(buf).length)/SIZE*100);
  const deflate = -((SIZE-zlib.deflateSync(buf).length)/SIZE*100);
  const gzip = -((SIZE-zlib.gzipSync(buf).length)/SIZE*100);
  const stats = {brotli,deflate,gzip,size: tb._size, type: 'byte'};
  console.log(`Brotli change: ${(brotli).toFixed(2)}%`);
  console.log(`Deflate change: ${(deflate).toFixed(2)}%`);
  console.log(`Gzip change: ${(gzip).toFixed(2)}%`);

  console.log('Done!\n');

  stats.avg = (stats.brotli + stats.deflate + stats.gzip)/3
  return stats;
}

function testHalfState(tb) {
  tb = tb || new TaroBox();
  console.log(`Testing half state output for ${tb._size}-byte state...`);

  let hs = tb.halfState();

  const MIN_SIZE = 1000000;
  const SIZE = MIN_SIZE + (hs.length - MIN_SIZE%hs.length)%hs.length;

  console.log(`Generating ${SIZE} pseudo-random bytes...`);

  const buf = new Buffer(SIZE);

  for( let i = 0; i < SIZE;) {
    hs.copy(buf, i);
    i += hs.length;
    hs = tb.halfState();
  }

  console.log(`Writing ${SIZE} bytes...`);

  fs.writeFileSync(path.resolve(out,Date.now()+'.halfstate.output.bin'), buf);

  console.log("Statistics...");
  const brotli = -((SIZE-zlib.brotliCompressSync(buf).length)/SIZE*100);
  const deflate = -((SIZE-zlib.deflateSync(buf).length)/SIZE*100);
  const gzip = -((SIZE-zlib.gzipSync(buf).length)/SIZE*100);
  const stats = {brotli,deflate,gzip,size: tb._size, type:'half'};
  console.log(`Brotli change: ${(brotli).toFixed(2)}%`);
  console.log(`Deflate change: ${(deflate).toFixed(2)}%`);
  console.log(`Gzip change: ${(gzip).toFixed(2)}%`);

  console.log('Done!\n');

  stats.avg = (stats.brotli + stats.deflate + stats.gzip)/3
  return stats;
}

function testQuarterState(tb) {
  tb = tb || new TaroBox();
  console.log(`Testing quarter state output for ${tb._size}-byte state...`);

  let hs = tb.quarterState();

  const MIN_SIZE = 1000000;
  const SIZE = MIN_SIZE + (hs.length - MIN_SIZE%hs.length)%hs.length;

  console.log(`Generating ${SIZE} pseudo-random bytes...`);

  const buf = new Buffer(SIZE);

  for( let i = 0; i < SIZE;) {
    hs.copy(buf, i);
    i += hs.length;
    hs = tb.quarterState();
  }

  console.log(`Writing ${SIZE} bytes...`);

  fs.writeFileSync(path.resolve(out,Date.now()+'.quarterstate.output.bin'), buf);

  console.log("Statistics...");
  const brotli = -((SIZE-zlib.brotliCompressSync(buf).length)/SIZE*100);
  const deflate = -((SIZE-zlib.deflateSync(buf).length)/SIZE*100);
  const gzip = -((SIZE-zlib.gzipSync(buf).length)/SIZE*100);
  const stats = {brotli,deflate,gzip,size: tb._size, type:'quarter'};
  console.log(`Brotli change: ${(brotli).toFixed(2)}%`);
  console.log(`Deflate change: ${(deflate).toFixed(2)}%`);
  console.log(`Gzip change: ${(gzip).toFixed(2)}%`);

  console.log('Done!\n');

  stats.avg = (stats.brotli + stats.deflate + stats.gzip)/3
  return stats;
}

function findBestConfig() {
  console.log("Finding best config...");
  const results = [];

  for( let state = 4; state <= 50; state++ ) {
    const tb = new TaroBox('', state);
    const half_result = testHalfState(tb);
    const quarter_result = testQuarterState(tb);
    results.push(half_result);
    results.push(quarter_result);
  }

  results.sort((a,b) => b.avg - a.avg);
  console.log("Sorted results:\n");
  console.log(JSON.stringify(results, null, 2));

  console.log("\nDone!\n");
}
