import {
  PactV3,
  MatchersV3
} from "@pact-foundation/pact";
import { eachLike } from "@pact-foundation/pact/src/v3/matchers";
import { API } from "./api";

const provider = new PactV3({
  consumer: "PRODUCT-WEB",
  provider: "PRODUCT-API",
});

const body =  {id: '1', type: 'credit_card', name: '28Deg'}

test("products exists", async () => {
  // Describe the Pact interaction
  await provider.addInteraction({
    uponReceiving: 'Retrieve all the products',
    withRequest: {
      method: 'GET',
      path: '/products',
      header: {
        'Accept': 'application/json',
      },
    },
    willRespondWith: {
      status: 200,
      body: eachLike(body)
    },
    /*
    states: undefined,
    */
  });

  // Create the test for the api, as a classic unitary test --> you can use jest, chai, ...
  await provider.executeTest(async (mockService) => {
    const api = new API(mockService.url);

    // the API will make a call to the Pact mock consumer
    const product = await api.getAllProducts();

    expect(Array.isArray(product)).toBe(true)
    expect(product[0]).toEqual(body)
  });
});