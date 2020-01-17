function compress(buf, size) {
  const newBuf = new Buffer(size);
  for( let i = 0; i < buf.length; i++ ) {
    const newBufIndex = i % size;
    newBuf[newBufIndex] = (newBuf[newBufIndex] + i) ^ buf[i];
  }
  return newBuf;
}

function expand(buf) {
  const str = buf.toString('base64');
  const expandedBuf = Buffer.from(str, 'utf8');
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
    for( let i = size; i < this._size; i++) {
      halfState[i%size] ^= this._state[i];
    }
    return halfState;
  }
  quarterState() {
    round(this._state, this._size);
    const size = this._size >> 2;
    const halfState = this._state.slice(0, size);
    for( let i = size; i < this._size; i++) {
      halfState[i%size] ^= this._state[i];
    }
    return halfState;
  }
  nState(n) {
    round(this._state, this._size);
    const size = n;
    const nState = new Buffer(n);
    for( let i = 0; i < Math.max(size, this._size); i++) {
      const j = i%this._size;
      nState[i%size] ^= this._state[j];
      if ( j == 0 ) {
        round(this._state, this._size);
      }
    }
    return nState;
  }
  hash(msg = '', seed = '', n = 8) {
    const size = n;
    this._state = setup(seed + msg, size);
    round(this._state, this._size);
    round(this._state, this._size);
    return this.nState(n);
  }
}
