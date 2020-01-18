# tarobox

TaroBox - A simple variable-size PRNG built from btoa and XOR

## Install

```
npm i --save tarobox
```

## Program

*Expansion step*

take the base64 of the data

*Compression step*

wrap the data to the origin state size, from end to start, and xor it, and add a counter to it

## Where did this idea come from?

It just came to me all in an instant. Out of nowhere.

I intuited that the combination of simple compression and expansion functions, 
with a counter, would produce good entropy / IID. And it does. I have experience doing this. 

## Where is the name from?

TaroBox is an anagram of the constituent parts "btoa" and "xor" 

## Hypothesis

This should be a pretty good PRNG for states of size 8 and above, and especially of size 20 and above

## First Test

Let's test it, at first just using ZIP tests.

Test 1 - Generate 1000000 random bytes, compress with gzip. Result: 0% compression with gzip.

## Testing Dieharder

```txt
cris@instance-10:~/tarobox/out$ dieharder -a -f 1579282146782.quarterstate.output.bin
#=============================================================================#
#            dieharder version 3.31.1 Copyright 2003 Robert G. Brown          #
#=============================================================================#
   rng_name    |           filename             |rands/second|
        mt19937|1579282146782.quarterstate.output.bin|  1.25e+08  |
#=============================================================================#
        test_name   |ntup| tsamples |psamples|  p-value |Assessment
#=============================================================================#
   diehard_birthdays|   0|       100|     100|0.63054096|  PASSED
      diehard_operm5|   0|   1000000|     100|0.82972225|  PASSED
  diehard_rank_32x32|   0|     40000|     100|0.08875046|  PASSED
    diehard_rank_6x8|   0|    100000|     100|0.53729987|  PASSED
   diehard_bitstream|   0|   2097152|     100|0.33156933|  PASSED
        diehard_opso|   0|   2097152|     100|0.03048742|  PASSED
        diehard_oqso|   0|   2097152|     100|0.92586646|  PASSED
         diehard_dna|   0|   2097152|     100|0.71856156|  PASSED
diehard_count_1s_str|   0|    256000|     100|0.68169134|  PASSED
diehard_count_1s_byt|   0|    256000|     100|0.93842717|  PASSED
 diehard_parking_lot|   0|     12000|     100|0.83699181|  PASSED
    diehard_2dsphere|   2|      8000|     100|0.94173528|  PASSED
    diehard_3dsphere|   3|      4000|     100|0.13307984|  PASSED
     diehard_squeeze|   0|    100000|     100|0.83053651|  PASSED
        diehard_sums|   0|       100|     100|0.00064588|   WEAK
        diehard_runs|   0|    100000|     100|0.82867342|  PASSED
        diehard_runs|   0|    100000|     100|0.63664718|  PASSED
       diehard_craps|   0|    200000|     100|0.51384935|  PASSED
       diehard_craps|   0|    200000|     100|0.53413237|  PASSED
 marsaglia_tsang_gcd|   0|  10000000|     100|0.41580093|  PASSED
 marsaglia_tsang_gcd|   0|  10000000|     100|0.69602633|  PASSED
         sts_monobit|   1|    100000|     100|0.11692296|  PASSED
            sts_runs|   2|    100000|     100|0.20282169|  PASSED
          sts_serial|   1|    100000|     100|0.55866871|  PASSED
          sts_serial|   2|    100000|     100|0.80888694|  PASSED
          sts_serial|   3|    100000|     100|0.93411152|  PASSED
          sts_serial|   3|    100000|     100|0.55576204|  PASSED
          sts_serial|   4|    100000|     100|0.36228091|  PASSED
          sts_serial|   4|    100000|     100|0.36746347|  PASSED
          sts_serial|   5|    100000|     100|0.34779400|  PASSED
          sts_serial|   5|    100000|     100|0.99572162|   WEAK
          sts_serial|   6|    100000|     100|0.46252464|  PASSED
          sts_serial|   6|    100000|     100|0.85963018|  PASSED
          sts_serial|   7|    100000|     100|0.36187509|  PASSED
          sts_serial|   7|    100000|     100|0.85233605|  PASSED
          sts_serial|   8|    100000|     100|0.23046603|  PASSED
          sts_serial|   8|    100000|     100|0.57841119|  PASSED
          sts_serial|   9|    100000|     100|0.05208725|  PASSED
          sts_serial|   9|    100000|     100|0.11816611|  PASSED
          sts_serial|  10|    100000|     100|0.81009544|  PASSED
          sts_serial|  10|    100000|     100|0.66603060|  PASSED
          sts_serial|  11|    100000|     100|0.32129033|  PASSED
          sts_serial|  11|    100000|     100|0.84710435|  PASSED
          sts_serial|  12|    100000|     100|0.77940946|  PASSED
          sts_serial|  12|    100000|     100|0.96854971|  PASSED
          sts_serial|  13|    100000|     100|0.92330888|  PASSED
          sts_serial|  13|    100000|     100|0.72536075|  PASSED
          sts_serial|  14|    100000|     100|0.92902365|  PASSED
          sts_serial|  14|    100000|     100|0.24155744|  PASSED
          sts_serial|  15|    100000|     100|0.66572577|  PASSED
          sts_serial|  15|    100000|     100|0.27094510|  PASSED
          sts_serial|  16|    100000|     100|0.70899871|  PASSED
          sts_serial|  16|    100000|     100|0.33778917|  PASSED
         rgb_bitdist|   1|    100000|     100|0.53637687|  PASSED
         rgb_bitdist|   2|    100000|     100|0.73362068|  PASSED
         rgb_bitdist|   3|    100000|     100|0.92855971|  PASSED
         rgb_bitdist|   4|    100000|     100|0.77969268|  PASSED
         rgb_bitdist|   5|    100000|     100|0.06584882|  PASSED
         rgb_bitdist|   6|    100000|     100|0.77761396|  PASSED
         rgb_bitdist|   7|    100000|     100|0.33120853|  PASSED
         rgb_bitdist|   8|    100000|     100|0.98221471|  PASSED
         rgb_bitdist|   9|    100000|     100|0.77080670|  PASSED
         rgb_bitdist|  10|    100000|     100|0.76485448|  PASSED
         rgb_bitdist|  11|    100000|     100|0.10982090|  PASSED
         rgb_bitdist|  12|    100000|     100|0.93405123|  PASSED
rgb_minimum_distance|   2|     10000|    1000|0.93648311|  PASSED
rgb_minimum_distance|   3|     10000|    1000|0.56841487|  PASSED
rgb_minimum_distance|   4|     10000|    1000|0.24477813|  PASSED
rgb_minimum_distance|   5|     10000|    1000|0.52409529|  PASSED
    rgb_permutations|   2|    100000|     100|0.06953411|  PASSED
    rgb_permutations|   3|    100000|     100|0.34361560|  PASSED
    rgb_permutations|   4|    100000|     100|0.75867462|  PASSED
    rgb_permutations|   5|    100000|     100|0.00601940|  PASSED
      rgb_lagged_sum|   0|   1000000|     100|0.58529783|  PASSED
      rgb_lagged_sum|   1|   1000000|     100|0.87141618|  PASSED
      rgb_lagged_sum|   2|   1000000|     100|0.33871451|  PASSED
      rgb_lagged_sum|   3|   1000000|     100|0.78573977|  PASSED
      rgb_lagged_sum|   4|   1000000|     100|0.98708610|  PASSED
      rgb_lagged_sum|   5|   1000000|     100|0.40632049|  PASSED
      rgb_lagged_sum|   6|   1000000|     100|0.21399633|  PASSED
      rgb_lagged_sum|   7|   1000000|     100|0.05012394|  PASSED
      rgb_lagged_sum|   8|   1000000|     100|0.97918395|  PASSED
      rgb_lagged_sum|   9|   1000000|     100|0.82662055|  PASSED
      rgb_lagged_sum|  10|   1000000|     100|0.14505170|  PASSED
      rgb_lagged_sum|  11|   1000000|     100|0.84077847|  PASSED
      rgb_lagged_sum|  12|   1000000|     100|0.87246652|  PASSED
      rgb_lagged_sum|  13|   1000000|     100|0.16108943|  PASSED
      rgb_lagged_sum|  14|   1000000|     100|0.76111031|  PASSED
      rgb_lagged_sum|  15|   1000000|     100|0.98681515|  PASSED
      rgb_lagged_sum|  16|   1000000|     100|0.84525286|  PASSED
      rgb_lagged_sum|  17|   1000000|     100|0.68884894|  PASSED
      rgb_lagged_sum|  18|   1000000|     100|0.86887118|  PASSED
      rgb_lagged_sum|  19|   1000000|     100|0.25865199|  PASSED
      rgb_lagged_sum|  20|   1000000|     100|0.74470804|  PASSED
      rgb_lagged_sum|  21|   1000000|     100|0.83868467|  PASSED
      rgb_lagged_sum|  22|   1000000|     100|0.90898368|  PASSED
      rgb_lagged_sum|  23|   1000000|     100|0.70905378|  PASSED
      rgb_lagged_sum|  24|   1000000|     100|0.44125915|  PASSED
      rgb_lagged_sum|  25|   1000000|     100|0.80288417|  PASSED
      rgb_lagged_sum|  26|   1000000|     100|0.76370352|  PASSED
      rgb_lagged_sum|  27|   1000000|     100|0.95937246|  PASSED
      rgb_lagged_sum|  28|   1000000|     100|0.82652308|  PASSED
      rgb_lagged_sum|  29|   1000000|     100|0.16390778|  PASSED
      rgb_lagged_sum|  30|   1000000|     100|0.18807017|  PASSED
      rgb_lagged_sum|  31|   1000000|     100|0.40957006|  PASSED
      rgb_lagged_sum|  32|   1000000|     100|0.98841531|  PASSED
     rgb_kstest_test|   0|     10000|    1000|0.65473288|  PASSED
     dab_bytedistrib|   0|  51200000|       1|0.11276164|  PASSED
             dab_dct| 256|     50000|       1|0.22546449|  PASSED
Preparing to run test 207.  ntuple = 0
        dab_filltree|  32|  15000000|       1|0.39004521|  PASSED
        dab_filltree|  32|  15000000|       1|0.92920851|  PASSED
Preparing to run test 208.  ntuple = 0
       dab_filltree2|   0|   5000000|       1|0.20205811|  PASSED
       dab_filltree2|   1|   5000000|       1|0.79826561|  PASSED
Preparing to run test 209.  ntuple = 0
        dab_monobit2|  12|  65000000|       1|0.29396868|  PASSED
```

## Benefits

- Passes [Dieharder](https://linux.die.net/man/1/dieharder)!
- Built with simple widely available primitivies (XOR, ADD, base64)
- Easy to conceptualize and remember
- Tunable parameters
- No magic constants or BS

## Possible applications

- For fun
- For producing statistically IID numbers / bits
- For constructing a proof-of-work / hash algorithm.
- For constructing a toy (or DIY, depending on your risk tolerance / trust) stream cipher.

-----

# *Be simple!*
