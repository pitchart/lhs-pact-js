You want to test happy paths.

You need to 
- list the endpoints you want to test
- find the result expected by the app 
- create the tests

You can bypass step 1 and 2 by refering to the pre-existing test in `/consumer/src/api.spec.js` or if you played the previous learning hour

## 1 - Identify the endpoints
By reading the `/consumer/src/api.js`, you can list the two endpoints consummed :
* `/products/`
* `/products/id`

## 2 - Identify expected results
Find usage of the `api.js` methods to see what objects are expected from these endpoints.

### Route 1: /products/
For `/products/`, usage is found in the `/consumer/src/App.js` file.
```js
API.getAllProducts()
    .then(r => {
        this.setState({
        	loading: false,
            products: r
        });
        this.determineVisibleProducts();
    })
    .catch(() => {
        this.setState({error: true})
    });
```
By following the products state,, you see it is mapped to a template
```js
const products = props.products.map(p => (
        <ProductTableRow key={p.id} product={p}/>
));
```
And looking at the template, it use the the `productPropTypes` prop type:
```js
const productPropTypes = {
    product: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
    }).isRequired
};
```
With this code, you know that an array of products, each product has 3 string properties: `id`, `name` and `type`, is expected by the consumer from the endpoint `/products/`.

### Route 2: /products/{id}
usage is found in `/consumer/src/ProductPage.js`
```js
API.getProduct(this.state.product.id).then(r => {
    this.setState({
        loading: false,
        product: r
    });
}).catch(() => {
    this.setState({error: true})
})
```
Usage is similar here, the api result's is put in the state.

No prop type here, but you can find usage for the product in the state here:
```js
<div>
    <p>ID: {this.state.product.id}</p>
    <p>Name: {this.state.product.name}</p>
    <p>Type: {this.state.product.type}</p>
</div>
```
The app expect one object with atleast the properties `id`, `name` and `type`

### note: using the producer to get expected data
You could start the producer and just hit those endpoint and get the resulting data, in order to build your test.
That is not the point of the PACT test in this case. We want to test according to what data the consummer is expecting, which may not be what the consumer is providing.

Testing the provider against the contract generated from the consumer test will tell you if there is a difference between the two. That is exactly the point of PACT testing.

## 3 - Create the tests
Start by creating a new provider
```js
const provider = new PactV3({
  consumer: "FrontendWebsite",
  provider: "ProductService"
});
```
There are [other options](https://docs.pact.io/implementation_guides/javascript/docs/consumer#api) to create a new Pact, but those ones are sufficient for now.

### Route 1: /products/
Register the test by adding an interaction to the provider ([doc](https://docs.pact.io/implementation_guides/javascript/docs/consumer#api))

Add the `withRequest` section, specifying the call the consumer perform (`GET /products`)


And the `willRespondWith` section too.

Try to be precise with what the consumer expect. It will limit futur integration problems

For some fields like the body, you can use the [Pact matcher](https://docs.pact.io/implementation_guides/javascript/docs/matching#v3-matching-rules) to describe precisely an object or a field

```js
test("products exists", async () => {
  // Describe the Pact interaction
  await provider.addInteraction({
    uponReceiving: "get all products", // unique name of the scenario
    withRequest: {
      method: "GET",
      path: "/products",
    },
    willRespondWith: {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: MatchersV3.eachLike({
        id: "09",
        type: "CREDIT_CARD",
        name: "Gem Visa",
      }),
    },
  });

  // Create the test for the api, as a classic unitary test --> you can use jest, chai, ...
  await provider.executeTest(async (mockService) => {
    const api = new API(mockService.url);

    // the API will make a call to the Pact mock consumer
    const product = await api.getAllProducts();

    expect(product).toStrictEqual([
      { 
      	id: "09",
      	name: "Gem Visa",
      	type: "CREDIT_CARD"
      },
    ]);
  });
});
```
You may add two products or more in the test, it will work the same.

### Route 2: /products/{id}
Same logic.
```js
test("product with 10 exists", async () => {
  // Describe the Pact interaction
  await provider.addInteraction({
    uponReceiving: "get product with ID 10",
    withRequest: {
      method: "GET",
      path: "/products/10",
    },
    willRespondWith: {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: MatchersV3.like({
        id: "10",
        type: "CREDIT_CARD",
        name: "28 Degrees",
      }),
    },
  });

  await provider.executeTest(async (mockService) => {
    const api = new API(mockService.url);

    const product = await api.getProduct("10");

    expect(product).toStrictEqual({
      id: "10",
      type: "CREDIT_CARD",
      name: "28 Degrees",
    });
  });
});
```