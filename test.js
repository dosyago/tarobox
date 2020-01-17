import TaroBox from './tarobox.js';

import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

const out = path.resolve(__dirname, 'out');

let key = Date.now();

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
  const brotli = -((SIZE-zlib.brotliCompressSync(buf).length));
  const deflate = -((SIZE-zlib.deflateSync(buf).length));
  const gzip = -((SIZE-zlib.gzipSync(buf).length));
  const brotlipc = brotli/SIZE*100;
  const deflatepc = deflate/SIZE*100;
  const gzippc = gzip/SIZE*100;
  const stats = {brotli,deflate,gzip,brotlipc, deflatepc, gzippc, size: tb._size, type:'quarter', key:key++};
  console.log(`Brotli change: ${(brotlipc).toFixed(2)}%`);
  console.log(`Deflate change: ${(deflatepc).toFixed(2)}%`);
  console.log(`Gzip change: ${(gzippc).toFixed(2)}%`);

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
  const brotli = -((SIZE-zlib.brotliCompressSync(buf).length));
  const deflate = -((SIZE-zlib.deflateSync(buf).length));
  const gzip = -((SIZE-zlib.gzipSync(buf).length));
  const brotlipc = brotli/SIZE*100;
  const deflatepc = deflate/SIZE*100;
  const gzippc = gzip/SIZE*100;
  const stats = {brotli,deflate,gzip,brotlipc, deflatepc, gzippc, size: tb._size, type:'half', key:key++};
  console.log(`Brotli change: ${(brotlipc).toFixed(2)}%`);
  console.log(`Deflate change: ${(deflatepc).toFixed(2)}%`);
  console.log(`Gzip change: ${(gzippc).toFixed(2)}%`);

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
  const brotli = -((SIZE-zlib.brotliCompressSync(buf).length));
  const deflate = -((SIZE-zlib.deflateSync(buf).length));
  const gzip = -((SIZE-zlib.gzipSync(buf).length));
  const brotlipc = brotli/SIZE*100;
  const deflatepc = deflate/SIZE*100;
  const gzippc = gzip/SIZE*100;
  const stats = {brotli,deflate,gzip,brotlipc, deflatepc, gzippc, size: tb._size, type:'quarter', key:key++};
  console.log(`Brotli change: ${(brotlipc).toFixed(2)}%`);
  console.log(`Deflate change: ${(deflatepc).toFixed(2)}%`);
  console.log(`Gzip change: ${(gzippc).toFixed(2)}%`);

  console.log('Done!\n');

  stats.avg = (stats.brotli + stats.deflate + stats.gzip)/3
  return stats;
}

function findBestConfig() {
  console.log("Finding best config...");
  const result = [];
  const start = Date.now();
  const MIN = 4;
  const MAX = 1456;

  for( let state = MIN; state <= MAX; state++ ) {
    const tb = new TaroBox('', state);
    const half_result = testHalfState(tb);
    const quarter_result = testQuarterState(tb);
    result.push(half_result);
    result.push(quarter_result);
  }

  const sorted = Array.from(result).map(({avg,type,size,key}) => ({avg,type,size,key}));;
  sorted.sort((a,b) => b.avg - a.avg);

  const end = Date.now();

  const duration_seconds = (end-start)/1000;
  const space_explored = MAX-MIN+1;
  const results = JSON.stringify({test:{at:new Date, space_explored, min: MIN, max: MAX, duration_seconds, sorted,result}}, null, 2);

  console.log("Sorted results:\n");
  
  console.log(results);

  console.log("Writing results to results.json file...");

  fs.writeFileSync(path.resolve(out,'results.json'), results);

  console.log("\nDone!\n");
}
