function compress(buf, size) {
  const newBuf = new Buffer(size);
  let newBufIndex = 0;
  // this loop can be parallelized
  for( let i = 0; i < buf.length; i++ ) {
    if ( newBufIndex >= size ) {
      newBufIndex = 0;
    } 
    newBuf[newBufIndex] = (newBuf[newBufIndex] + i) ^ buf[i];
    newBufIndex++;
  }
  return newBuf;
}

function expand(buf) {
  const str = buf.toString('base64');
  const expandedBuf = Buffer.from(str, 'binary');
  return expandedBuf;
}

function round(state, size) {
  const stateCopy = Buffer.from(state);
  const expandedState = expand(stateCopy);
  const compressedExpandedState = compress(expandedState, size);
  compressedExpandedState.copy(state, 0, 0, size);
}

function setup(str, size) {
  const state = new Buffer(size);
  const strBuf = Buffer.from(str);
  const compressedStrBuf = compress(strBuf, size);
  compressedStrBuf.copy(state, 0, 0, size);
  return state;
}

export default class TaroBox {
  constructor(seed = '', size = 41) {
    this._size = size;
    this._state = setup(seed, size);
  }
  random() {
    round(this._state, this._size);
    return Array.from(this._state).reduce((sum, val) => sum + val, 0);
  }
  halfState() {
    round(this._state, this._size);
    const size = this._size >> 1;
    const halfState = this._state.slice(0, size);
    // this loop can be parallelized
    for( let i = size; i < this._size; i++) {
      halfState[i%size] ^= this._state[i];
    }
    return halfState;
  }
  quarterState() {
    round(this._state, this._size);
    const size = this._size >> 2;
    const halfState = this._state.slice(0, size);
    // this loop can be parallelized
    for( let i = size; i < this._size; i++) {
      halfState[i%size] ^= this._state[i];
    }
    return halfState;
  }
  nState(n) {
    const size = n;
    const nState = new Buffer(n);
    if ( size <= this._size >> 2 ) {
      // this loop can be parallelized
      for( let i = 0; i < this._size; i++) {
        nState[i%size] ^= this._state[i];
      }
    } else {
      // this loop can be parallelized
      for( let i = 0; i < size;) {
        const qs = this.quarterState();
        qs.copy(nState, i, 0, Math.min(size - i, qs.length));
        i += qs.length;
      }
    }
    return nState;
  }
  hash(msg = '', seed = '', n = 8, rounds = 0) {
    const size = n;
    this._state = setup(seed + msg, this._size);
    // this loop CANNOT be parallelized
    for( let i = 0; i < rounds; i++ ) {
      round(this._state, this._size);
    }
    return this.nState(n);
  }
}
