Run cd frontend

> memora-frontend@1.0.0 test
> vitest


 RUN  v1.6.1 /home/runner/work/memora-mvp/memora-mvp/frontend

include: **/*.{test,spec}.?(c|m)[jt]s?(x)
exclude:  **/node_modules/**, **/dist/**, **/cypress/**, **/.{idea,git,cache,output,temp}/**, **/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*
watch exclude:  **/node_modules/**, **/dist/**

No test files found, exiting with code 1
Error: Process completed with exit code 1.

Run cd backend

> memora-backend@1.0.0 lint
> eslint src --ext .ts,.tsx


Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find the config "@typescript-eslint/recommended" to extend from. Please check that the name of the config is correct.

The config "@typescript-eslint/recommended" was referenced from the config file in "/home/runner/work/memora-mvp/memora-mvp/backend/.eslintrc.js".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.

Error: Process completed with exit code 2.


Run github/codeql-action/upload-sarif@v2
Error: CodeQL Action major versions v1 and v2 have been deprecated. Please update all occurrences of the CodeQL Action in your workflow files to v3. For more information, see https://github.blog/changelog/2025-01-10-code-scanning-codeql-action-v2-is-now-deprecated/
Warning: Resource not accessible by integration
Uploading results
  Processing sarif files: ["trivy-results.sarif"]
  Validating trivy-results.sarif
  Combining SARIF files using the CodeQL CLI
  Adding fingerprints to SARIF file. See https://docs.github.com/en/enterprise-cloud@latest/code-security/code-scanning/integrating-with-code-scanning/sarif-support-for-code-scanning#providing-data-to-track-code-scanning-alerts-across-runs for more information.
  Uploading results
  Warning: Resource not accessible by integration
  Error: Resource not accessible by integration
  Warning: Resource not accessible by integration

