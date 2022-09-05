# HTTP consumer tests with the Pact DSL
## JS Practice
Implents Pact test for happy path (200/201) for the API in this consumer app, in the `api.pact.spec.js` file.

**hint**: launch the `npm install` as soon as possible, it takes some time

You can start the tests from the `consumer` folder with;
```bash
react-scripts test --testTimeout=30000 api.pact.spec.js
```

or from the root folder with:
```bash
npm run test:pact --prefix consumer
```

Documentation needed can be found here:
* [Consumer test](https://docs.pact.io/implementation_guides/javascript/docs/consumer)

* [DSL matching rules](https://docs.pact.io/implementation_guides/javascript/docs/matching#v3-matching-rules)

If you can't find what to test, you *may* look at the `api.spec.js` that performs the same tests without Pact. 


## Solution
Solution is avaible in the `solution.api.pact.spec.js`. Explaination for the solution are in [Solution.md](Solution.md)