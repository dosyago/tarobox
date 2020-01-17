#include <math.h>
#include "tarobox.h"
#include "base64/include/libbase64.h"

#if defined(_MSC_VER)

#define FORCE_INLINE	__forceinline

// Other compilers

#else	// defined(_MSC_VER)

#define	FORCE_INLINE inline __attribute__((always_inline))

#endif // !defined(_MSC_VER)

//---------
// compress function : compress the state back into its size

FORCE_INLINE uint8_t* compress ( uint8_t * buf, int bufLen, int size )
{
  uint8_t newBuf[size];
  int newBufIndex = 0;

  #pragma omp parallel for
  for( int i = 0; i < bufLen; i++ ) {
    if( newBufIndex >= size ) {
      newBufIndex = 0;
    }
    newBuf[newBufIndex] = (newBuf[newBufIndex] + i) ^ buf[i];
    newBufIndex++;
  }

  return newBuf;
}

FORCE_INLINE uint8_t* expand ( uint8_t * buf, int bufLen )
{
  // 
}

//---------
// round function : process the state

FORCE_INLINE void round ( const uint8_t * state, int size )
{
  //
}

//---------
// setup function : setup the state

FORCE_INLINE void setup ( const uint8_t *str, int size, uint8_t *state ) 
{
  //
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
    h[i&3] ^= state[i];
  }


  ((uint8_t*)out) = h; 
}

//---------
// tarobox
// simple hash primitive built with base64 and xor

void tarobox_64 ( const void * key, int len,
                   uint32_t seed, void * out )
{
  const int SIZE = 41;
  const int ROUNDS = 8;
  const uint8_t * data = (const uint8_t *)key;
  uint8_t state [SIZE];

  // concatenate seed + key
  // call it msg
  setup( msg, SIZE, state );

  for( int i = 0; i < ROUNDS; i++) {
    round(state, SIZE);
  }

  nState(state, SIZE, out);
} 

