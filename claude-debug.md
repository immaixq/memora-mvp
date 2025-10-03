Firebase Admin not initialized - missing environment variables
prisma:warn Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-1.1.x".
Please manually install OpenSSL and try installing Prisma again.
Failed to start server: PrismaClientInitializationError: Unable to require(`/app/node_modules/.prisma/client/libquery_engine-linux-musl.so.node`).
The Prisma engines do not seem to be compatible with your system. Please refer to the documentation about Prisma's system requirements: https://pris.ly/d/system-requirements
Details: Error loading shared library libssl.so.1.1: No such file or directory (needed by /app/node_modules/.prisma/client/libquery_engine-linux-musl.so.node)
    at Object.loadLibrary (/app/node_modules/@prisma/client/runtime/library.js:111:10243)
    at async _r.loadEngine (/app/node_modules/@prisma/client/runtime/library.js:112:448)
    at async _r.instantiateLibrary (/app/node_modules/@prisma/client/runtime/library.js:111:12599)
    at async _r.start (/app/node_modules/@prisma/client/runtime/library.js:112:1976)
    at async startServer (/app/dist/index.js:82:9) {
  clientVersion: '5.22.0',
  errorCode: undefined
}