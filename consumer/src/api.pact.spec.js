import {
  PactV3,
} from "@pact-foundation/pact";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import { eachLike } from "@pact-foundation/pact/src/v3/matchers";
import { API } from "./api";

const provider = new PactV3({
  consumer: "PRODUCT-WEB",
  provider: "PRODUCT-API",
});

const body =  {id: '1', type: 'credit_card', name: '28Deg'}
const getAProduct = (id)  => ({
  method: 'GET',
  path: `/products/${id}`,
  header: {
    'Accept': 'application/json',
  }
})


describe('product list', () => {
  it("should retrieve all products", async () => {
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
    });

    await provider.executeTest(async (mockService) => {
      const api = new API(mockService.url);

      const product = await api.getAllProducts();

      expect(Array.isArray(product)).toBe(true)
      expect(product[0]).toEqual(body)
    });
  });
});

describe('product details', () => {

it("should retrieve a product when it exists", async () => {
  // arrange
  await provider.addInteraction({
    uponReceiving: 'Retrieve a product with an id',
    withRequest: getAProduct(1),
    willRespondWith: {
      status: 200,
      body: like(body)
    },
  });

  await provider.executeTest(async (mockService) => {
    const api = new API(mockService.url);

    // act
    const product = await api.getProduct(1);

    // assert
    expect(product).toEqual(body)
  });
});

it("should throw an error when id does not exists", async () => {
  await provider.addInteraction({
    uponReceiving: 'Retrieve a product with a not existing id',
    withRequest: getAProduct(19),
    willRespondWith: {
      status: 404,
    },
  });

  await provider.executeTest(async (mockService) => {
    const api = new API(mockService.url);

    const httpCall = async () => {
      await api.getProduct(19);
    }

    await expect(httpCall()).rejects.toThrow();
  });
});
})

