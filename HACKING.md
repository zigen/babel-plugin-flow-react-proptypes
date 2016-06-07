
Clone the repo, and run `npm install`.

To run the "tests" run `npm run test`.

Instead of normal unit tests, there are example .input.js and output.js files which are manually inspected for correctness.
They're checked into git so you can easily diff them when changes are made.

When fixing a bug, add a new test. Put the file in src/__test__/fixtures/{something}.input.js. `npm run test` will
create the output file.

