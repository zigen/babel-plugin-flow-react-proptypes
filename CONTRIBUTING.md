
Clone the repo, and run `npm install`.

To run linting run `npm run lint`.

To run the "tests" run `npm run test`.

Currently all tests are jest snapshot tests. Create a new file in src/__tests__ based on an existing file, update the code, and then run the tests.

To run in watch mode: `npm run test -- --watch`, and then you can filter the tests by following the instructions on screen.

If tests are failing due to snapshots changing, press <kbd>u</kbd> in watch mode, or `npm run test -- -u` to update them.

Make sure to add your tests when you commit.

