#include <math.h>
#include <string.h>
#include "tarobox.h"
#include "base64/include/libbase64.h"

const int SIZE = 41;
const int ROUNDS = 8;

#if defined(_MSC_VER)

#define FORCE_INLINE	__forceinline

// Other compilers

#else	// defined(_MSC_VER)

#define	FORCE_INLINE inline __attribute__((always_inline))

#endif // !defined(_MSC_VER)

//---------
// compress function : compress the state back into its size

FORCE_INLINE uint8_t* compress ( uint8_t * buf, int bufLen )
{
  int endOffset;
  uint8_t newBuf[SIZE];
  return compressOffset( newBuf, buf, bufLen, 0, &endOffset );
}

FORCE_INLINE uint8_t* compressOffset ( uint8_t * newBuf, uint8_t * buf, int bufLen, int startOffset, int * offset )
{
  int newBufIndex = startOffset;

  #pragma omp parallel for
  for( int i = 0; i < bufLen; i++ ) {
    if( newBufIndex >= SIZE ) {
      newBufIndex = 0;
    }
    newBuf[newBufIndex] = (newBuf[newBufIndex] + i) ^ buf[i];
    newBufIndex++;
  }

  *offset = newBufIndex;
  return newBuf;
}

FORCE_INLINE uint8_t* expand ( uint8_t * buf, int bufLen, int * outlen )
{
  char * src = (char *)buf;
  char out[60];
  uint8_t * outBuf = out;

  base64_encode(src, bufLen, out, outlen);

  return outBuf;
}

//---------
// round function : process the state

FORCE_INLINE void round ( const uint8_t * state )
{
  int expandLen;
  uint8_t * expandedState;
  uint8_t * compressedExpandedState;

  uint8_t stateCopy[SIZE];
  memcpy(stateCopy, state, SIZE);
  expandedState = expand(stateCopy, SIZE, &expandLen);
  compressedExpandedState = compress(expandedState, expandLen);
  memcpy(state, compressedExpandedState, SIZE);
}

//---------
// setup function : setup the state

FORCE_INLINE void setup ( const uint8_t *str, int length, uint32_t seed, uint8_t *state ) 
{
  //
  uint8_t newState[SIZE];
  uint8_t * seed8 = &seed;
  int restartOffset;

  compressOffset( newState, str, size, 0, &restartOffset );
  compressOffset( newState, seed8, 4, restartOffset, &restartOffset );

  memcpy(state, newState, SIZE);
}

//---------
// nState function : from the state produce n bytes of hash for output

FORCE_INLINE void nState( uint8_t *state, int size, void * out ) 
{
  uint8_t  output [8];
  uint8_t * h = (uint8_t*)output;

  // do nState stuff
  #pragma omp parallel for
  for ( int i = 0; i < size; i++ ) {
    h[i&7] ^= state[i];
  }

  ((uint8_t*)out) = h; 
}

//---------
// tarobox
// simple hash primitive built with base64 and xor

void tarobox_64 ( const void * key, int len,
                   uint32_t seed, void * out )
{
  const uint8_t * data = (const uint8_t *)key;
  uint8_t state [SIZE];

  // concatenate seed + key
  // call it msg
  setup( msg, len, seed, state );

  for( int i = 0; i < ROUNDS; i++) {
    round(state);
  }

  nState(state, SIZE, out);
} 

