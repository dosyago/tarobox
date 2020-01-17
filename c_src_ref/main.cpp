#include <stdio.h>	/* fwrite */
#include "libbase64.h"
#include "tarobox.h"

int main ()
{
	char src[] = "hello world";
	char out[20];
  char out2[8];
	size_t srclen = sizeof(src) - 1;
	size_t outlen;

	base64_encode(src, srclen, out, &outlen, 0);

  tarobox_64((void *)out, (int)outlen, 0, (void *)out2 );

	fwrite(out, outlen, 1, stdout);
	fwrite(out2, 8, 1, stdout);

	return 0;
}
