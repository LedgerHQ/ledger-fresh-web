export const getKeyCredentialCreationOptions = (
  challenge: ArrayBuffer,
  currentDomain: string,
  username: string,
  userId: Buffer
): CredentialCreationOptions => ({
  publicKey: {
    // the challenge is passed by the server and need to be returned to the server
    // at the end of the registration process for verification
    challenge,
    rp: {
      // name of your entity
      name: "MyEntity",
      id: currentDomain,
    },
    // the id must be passed by the server, it would be hashed and the output would
    // be stored in the returned certificate
    user: {
      id: userId,
      // TODO: check if it's safe
      name: userId.toString(),
      displayName: username,
    },
    // wanna use another algorithms? Here's the list
    // https://www.iana.org/assignments/cose/cose.xhtml#algorithms
    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
    timeout: 60000,
    // 'indirect' means the certificate generated by the authenticator would be anonymised
    // https://w3c.github.io/webauthn/#attestation-conveyance
    attestation: "indirect",
    authenticatorSelection: {
      requireResidentKey: true,
      residentKey: "required",
      // TODO: check what type of user verification is the best
      userVerification: "required",
    },
  },
});

// the id represents the hash returned by the authenticator during the registration process
export const getRequestOptions = (
  challenge: ArrayBuffer
): CredentialRequestOptions => ({
  publicKey: {
    timeout: 60000,
    challenge,
    // https://developers.yubico.com/WebAuthn/WebAuthn_Developer_Guide/User_Presence_vs_User_Verification.html
    userVerification: "required",
  },
});
