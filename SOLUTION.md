## Inspect `consumer/src/api.spec.js`
The tests mock the producer in order to test the api.js methods.

Problem with this kind of tests is that it only verify the consumer. The tests are isolated and do not [ensure the app will work globally](https://pactflow.io/how-pact-works/#slide-2).

## Launch the app
If you start consumer and provider, you can see that you cannot browse a product detail.

On closer inspection, the path to see one product is `product/{id}` in the producer.

But the consumer try to call `products/{id}`. Thus showing the isolated tests limitations.