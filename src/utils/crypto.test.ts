import * as crypto from "./crypto";

describe("crypto", () => {
  describe("generateChallenge", () => {
    it("returned challenge is valid base64 string", () => {
      const challenge = crypto.generateChallenge().toString("base64");

      // regex to validate a string is encoded in base64
      const base64regex =
        /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
      expect(base64regex.test(challenge)).toBe(true);
    });

    it("returned challenge has the correct size", () => {
      const challenge = crypto.generateChallenge().toString("base64");
      /**
       * Each character is used to represent 6 bits (log2(64) = 6).
       * Therefore 4 chars are used to represent 4 * 6 = 24 bits = 3 bytes.
       * So we need 4*(n/3) chars to represent n bytes, and this needs to be rounded up to a multiple of 4.
       * The formula to get the round up nearest multiple of 4 is:
       * ((4 * n / 3) + 3) & ~3
       * as we generate a buffer of 64 bytes, n = 64 in our case
       */
      const expectedSize = ((4 * 64) / 3 + 3) & ~3;
      expect(new Blob([challenge]).size).toBe(expectedSize);
    });
  });

  describe("createUserId", () => {
    it("returned user id is valid hex string", () => {
      const userId = crypto.createUserId("qdqd", Date.now());
      console.log(userId);

      // regex to validate a string is encoded in base64
      const hexRegex = /^[0-9a-fA-F]+$/;
      expect(hexRegex.test(userId)).toBe(true);
    });

    it("returned user id is sha256 output", () => {
      const userId = crypto.createUserId("qdqd", Date.now());
      const sha256regex = /^[a-f0-9]{64}$/gi;

      // regex to validate the user id is sha256 output
      expect(userId.length).toBe(64);
      expect(sha256regex.test(userId)).toBe(true);
    });
  });
});
