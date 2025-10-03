builder
RUN apt-get update && apt-get install -y openssl libssl1.1 && rm -rf /var/lib/apt/lists/*
1s
Get:1 http://deb.debian.org/debian bookworm InRelease [151 kB]
Get:2 http://deb.debian.org/debian bookworm-updates InRelease [55.4 kB]
Get:3 http://deb.debian.org/debian-security bookworm-security InRelease [48.0 kB]
Get:4 http://deb.debian.org/debian bookworm/main amd64 Packages [8791 kB]
Get:5 http://deb.debian.org/debian bookworm-updates/main amd64 Packages [6924 B]
Get:6 http://deb.debian.org/debian-security bookworm-security/main amd64 Packages [281 kB]
Fetched 9333 kB in 1s (9086 kB/s)
Reading package lists...
Reading package lists...
Dockerfile:35
-------------------
33 |
34 |     # Install OpenSSL and other required dependencies for Prisma runtime
35 | >>> RUN apt-get update && apt-get install -y openssl libssl1.1 && rm -rf /var/lib/apt/lists/*
36 |
37 |     # Create app directory
-------------------
ERROR: failed to build: failed to solve: process "/bin/sh -c apt-get update && apt-get install -y openssl libssl1.1 && rm -rf /var/lib/apt/lists/*" did not complete successfully: exit code: 100