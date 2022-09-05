import {
  PactV3,
  MatchersV3
} from "@pact-foundation/pact";
import { API } from "./api";

const provider = new PactV3({
  consumer: "",
  provider: "",
});

test("products exists", async () => {
  // Describe the Pact interaction
  await provider.addInteraction({
  
  });

  // Create the test for the api, as a classic unitary test --> you can use jest, chai, ...
  await provider.executeTest(async (mockService) => {
    const api = new API(mockService.url);

    // the API will make a call to the Pact mock consumer
    const product = await api.getAllProducts();
  });
});