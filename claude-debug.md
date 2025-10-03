builder
RUN npm run build
278ms
> memora-backend@1.0.0 build
> tsc
sh: tsc: not found
Dockerfile:20
-------------------
18 |
19 |     # Build the application
20 | >>> RUN npm run build
21 |
22 |     # Production stage
-------------------
ERROR: failed to build: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 127
