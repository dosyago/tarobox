# tarobox

TaroBox - A simple variable-size PRNG built from btoa and XOR

## Program

*Compression step*

```
  input - raw data, compressed length

  output - data of compressed length

  procedure - simply wrap around the data from end to start, and xor it, and add a counter to it

  operations are done modulo 256
```

*Expansion step*

```
  input - compressed data

  output - raw data

  procedure - take the btoa of the data (performing any necessary conversion first to make the data valid input for btoa)
```

## Hypothesis

This should be a pretty good PRNG for states of size 8 and above, and especially of size 20 and above

## Benefits

- Built with simple widely available primitivies (XOR, ADD, BTOA)
- Easy to conceptualize and remember
- Tunable parameters
- No magic constants or BS

## Costs

- Slow if secure (we sum the state to produce output byte), yielding 1 byte of IID and entropy per round.
- Fast but insecure (we could run in 'streaming' mode, just output the entire state on each round,
yielding 20 bytes of IID per round but zero bytes of entropy (since you can reconstruct the next state from this one).
- Untested. It passes gzip/zip test. Even if it passes SMHasher / PractRand, it's not "cryptographic".

## Testing

Let's test it, at first just using ZIP tests.

Test 1 - Generate 1000000 random bytes, compress with gzip. Result: 0% compression with gzip.

## Possible applications

- For fun
- For producing statistically IID numbers / bits
- For constructing a proof-of-work / hash algorithm.
- For constructing a toy (or DIY, depending on your risk tolerance / trust) stream cipher.

## Where did this idea come from?

It just came to me all in an instant. Out of nowhere.

I intuited that the combination of simple compression and expansion functions, 
with a counter, would produce good entropy / IID. And it does. I have experience doing this. 

## Where is the name from?

TaroBox is an anagram of the constituent parts "btoa" and "xor" 
