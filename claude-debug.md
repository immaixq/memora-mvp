builder
RUN apk add --no-cache openssl1.1-compat
1s
fetch https://dl-cdn.alpinelinux.org/alpine/v3.21/main/x86_64/APKINDEX.tar.gz
fetch https://dl-cdn.alpinelinux.org/alpine/v3.21/community/x86_64/APKINDEX.tar.gz
ERROR: unable to select packages:
  openssl1.1-compat (no such package):
    required by: world[openssl1.1-compat]

production
RUN apk add --no-cache openssl1.1-compat
1s
fetch https://dl-cdn.alpinelinux.org/alpine/v3.21/main/x86_64/APKINDEX.tar.gz
fetch https://dl-cdn.alpinelinux.org/alpine/v3.21/community/x86_64/APKINDEX.tar.gz
ERROR: unable to select packages:
  openssl1.1-compat (no such package):
    required by: world[openssl1.1-compat]
Dockerfile:35
-------------------
33 |
34 |     # Install OpenSSL and other required dependencies for Prisma runtime
35 | >>> RUN apk add --no-cache openssl1.1-compat
36 |
37 |     # Create app directory
-------------------
ERROR: failed to build: failed to solve: process "/bin/sh -c apk add --no-cache openssl1.1-compat" did not complete successfully: exit code: 1
