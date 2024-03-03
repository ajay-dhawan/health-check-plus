# Health Check Plus

This utility provides functionality to retrieve version information for a JavaScript application from its `package.json` file and the latest commit hash from the associated Git repository. Additionally, it updates the `package.json` file with the latest commit hash for use in health checks.

## How to Use

### CommonJS (Node.js)

1. Install the required dependencies by running the following command:

   ```bash
   npm install simple-git
   ```

2. Create a JavaScript file (e.g., `app.js`) and include the following code:

   ```javascript
   const { GetVersionInfo } = require('./version-info');

   async function main() {
       try {
           const versionInfo = await GetVersionInfo();
           console.log('Version:', versionInfo.version);
           console.log('Commit Hash:', versionInfo.commitHash);
       } catch (error) {
           console.error('Error:', error);
       }
   }

   main();
   ```

### ES Module (Browser or Node.js)

1. Install the required dependencies by running the following command:

   ```bash
   npm install simple-git
   ```

2. Create a JavaScript file (e.g., `app.mjs`) and include the following code:

   ```javascript
   import { GetVersionInfo } from './version-info.mjs';

   async function main() {
       try {
           const versionInfo = await GetVersionInfo();
           console.log('Version:', versionInfo.version);
           console.log('Commit Hash:', versionInfo.commitHash);
       } catch (error) {
           console.error('Error:', error);
       }
   }

   main();
   ```

3. Run your application:

   - For Node.js:

     ```bash
     node --experimental-modules app.mjs
     ```

   - For browsers, make sure to use a module bundler like Webpack or rollup.js.

## Health Checks

To facilitate health checks, this utility automatically updates the `package.json` file with the latest commit hash. This allows health checks to read the latest commit hash from the `package.json` file.

## Code Explanation

- The `GetVersionInfo` function retrieves version information from the `package.json` file and the latest commit hash from the associated Git repository.
- It accepts two optional parameters: `packageJsonPath` (path to the `package.json` file) and `versionInfo` (existing version information).
- The `AppVersionInfo` class represents version information with properties for version and commit hash.
- The utility exports the `AppVersionInfo` class and the `GetVersionInfo` function for external use.

---

Save this content into a file named `readme.md` in the root directory of your project. This `readme.md` file provides comprehensive instructions on how to use the provided utility both as a CommonJS module and as an ES Module, along with explanations of the code functionality and its integration with health checks.