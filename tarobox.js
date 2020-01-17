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
  constructor(seed = '', size = 45) {
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
}
