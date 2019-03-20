# tarobox

TaroBox - A simple variable-size PRNG built from btoa and XOR

## Program

*Compression step*

input - raw data, compressed length

output - data of compressed length

procedure - simply wrap around the data from end to start, and xor it, and add a counter to it

operations are done modulo 256

*Expansion step*

input - compressed data

output - raw data

procedure - take the btoa of the data (performing any necessary conversion first to make the data valid input for btoa)

## Hypothesis

This should be a pretty good PRNG for states of size 8 and above, and especially of size 20 and above

## Benefits

- Built with simple widely available primitivies (XOR, ADD, BTOA)
- Easy to conceptualize and remember
- Tunable parameters
- No magic constants or BS

## Testing

Let's test it, at first just using ZIP tests.
