# Consumer driven contract testing with Pact
Full README can be found here: [Facilitation.md](https://sources.insidegroup.fr/id2s/training/craftsmanship/contract-testing-with-pact/contract-testing-learning-hours/-/blob/master/cdct-with-pact/Facilitation.md)

## Concrete Practice
The project contains 2 apps. One front (consumer) using the API provided by the backend (producer).
Inspect existing tests in `consumer/src/api.spec.js`.
You can run it from the root folder:
```bash
npm i
npm test --prefix consumer
```

---

You may start both projects to see if the app works well. From root folder:
```bash
npm i # if not already done
npm start --prefix provider
```
From another terminal:
```bash
npm start --prefix consumer
```

If you go to the url specified in the consumer process and browse through it, do you see any problem ?