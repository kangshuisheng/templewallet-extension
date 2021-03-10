import { encryptAndSaveMany, fetchAndDecryptOne, isStored, removeMany } from "./safe-storage";
import { generateKey } from "../passworder";
import { browser } from "webextension-polyfill-ts";

let storageKey = "test"
let passKey: CryptoKey


describe("Safe Storage tests", () => {

  beforeAll(async () => {
    passKey = await generateKey("passKey")
  })

  it("isStored test", async () => {
    await encryptAndSaveMany([[storageKey, 1]], passKey)
    expect(await isStored(storageKey)).toBeTruthy()
  });

  it("fetchEncryptedOne test", async () => {
    expect(await fetchAndDecryptOne(storageKey, passKey)).toBe(1)
  })

  it("encryptAndSaveMany test", async () => {
    await encryptAndSaveMany([[storageKey + "1", 1]], passKey)
    expect(await fetchAndDecryptOne(storageKey + "1", passKey)).toBe(1)
  });

  it("removeMany test", async () => {
    await removeMany([storageKey])
    expect(await browser.storage.local.get(storageKey)).toMatchObject({})
  });
});
