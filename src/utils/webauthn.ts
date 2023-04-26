import {
  hash,
  number,
  transaction,
  Abi,
  Call,
  InvocationsSignerDetails,
  Signature,
} from "starknet";
import base64url from "base64url";
import BN from "bn.js";
import { constants } from "@/utils/constant";

export function bnToCairoBN(n: BN): {
  x: BN;
  y: BN;
  z: BN;
} {
  const BASE = number.toBN(2).pow(number.toBN(86));
  const x = n.mod(BASE);
  const y = n.div(BASE).mod(BASE);
  const z = n.div(BASE).div(BASE);
  return { x, y, z };
}

/**
 *  splitting a pubkey into an ECpoint.
 * @param pubkey prefixed PKCS11 key.
 * @returns ECpoint (x,y)
 */
export const parsePubKey = (pubkey: string): { x: string; y: string } => {
  return {
    x: pubkey.slice(2, 66),
    y: pubkey.slice(66),
  };
};

export type RawAssertion = PublicKeyCredential & {
  response: AuthenticatorAssertionResponse;
};

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
      name: "Fresh",
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

/**
 * Sign and send transaction
 * @param calls
 * @param transactionsDetail
 * @param credentialId
 * @returns
 */
export const signAndSendTransaction = async (
  calls: Call[],
  transactionsDetail: InvocationsSignerDetails,
  credentialId: string
): Promise<string> => {
  const calldata = transaction.fromCallsToExecuteCalldata(calls);

  const txHash = hash.calculateTransactionHash(
    transactionsDetail.walletAddress,
    transactionsDetail.version,
    calldata,
    transactionsDetail.maxFee,
    transactionsDetail.chainId,
    transactionsDetail.nonce
  );

  let challenge = Buffer.from(
    txHash.slice(2).padStart(64, "0").slice(0, 64),
    "hex"
  );

  const currentDomain = window.location.hostname;
  const assertion = await sign(challenge, currentDomain, credentialId);
  const signature = formatAssertion(assertion);
  const res: { transaction_hash: string } = await fetch(
    "/api/deployer/addTransaction",
    {
      method: "POST",
      body: JSON.stringify({
        transactionsDetail,
        calldata,
        signature,
      }),
    }
  ).then((response) => response.json());
  return res.transaction_hash;
};

async function sign(
  challenge: BufferSource,
  rpId: string,
  credentialId: string
): Promise<RawAssertion> {
  return (await navigator.credentials.get({
    publicKey: {
      challenge,
      timeout: 60000,
      rpId: rpId,
      allowCredentials: [
        {
          type: "public-key",
          id: base64url.toBuffer(credentialId),
        },
      ],
      userVerification: "required",
    },
  })) as unknown as PublicKeyCredential & {
    response: AuthenticatorAssertionResponse;
  };
}

// see https://gist.github.com/philholden/50120652bfe0498958fd5926694ba354?permalink_comment_id=3744585#gistcomment-3744585
function extractRSfromSignature(signature: ArrayBuffer) {
  const usignature = new Uint8Array(signature);
  const rStart = usignature[4] === 0 ? 5 : 4;
  const rEnd = rStart + 32;
  const sStart = usignature[rEnd + 2] === 0 ? rEnd + 3 : rEnd + 2;
  const r = usignature.slice(rStart, rEnd);
  const s = usignature.slice(sStart);

  return {
    r: "0x" + Buffer.from(r).toString("hex"),
    s: "0x" + Buffer.from(s).toString("hex"),
  };
}

// create a wordArray that is Big-Endian (because it's used with CryptoJS which is all BE)
// From: https://gist.github.com/creationix/07856504cf4d5cede5f9#file-encode-js
function convertUint8ArrayToWordArray(u8Array: Uint8Array): number[] {
  var words = [],
    i = 0,
    len = u8Array.length;

  while (i < len) {
    words.push(
      ((u8Array[i++] << 24) |
        (u8Array[i++] << 16) |
        (u8Array[i++] << 8) |
        u8Array[i++]) >>>
        0
    );
  }

  return words;
}

export function formatAssertion(assertion: RawAssertion): Signature {
  var authenticatorDataBytes = new Uint8Array(
    assertion.response.authenticatorData
  );
  var clientDataJSONBytes = new Uint8Array(assertion.response.clientDataJSON);

  const clientDataWords = convertUint8ArrayToWordArray(clientDataJSONBytes);
  const authenticatorDataWords = convertUint8ArrayToWordArray(
    authenticatorDataBytes
  );

  let authDataRem = authenticatorDataBytes.length % 4;
  authDataRem = authDataRem === 0 ? 0 : 4 - authDataRem;

  let clientDataJSONRem = clientDataJSONBytes.length % 4;
  clientDataJSONRem = clientDataJSONRem === 0 ? 0 : 4 - clientDataJSONRem;

  const { r, s } = extractRSfromSignature(assertion.response.signature);

  const { x: r0, y: r1, z: r2 } = bnToCairoBN(number.toBN(r));
  const { x: s0, y: s1, z: s2 } = bnToCairoBN(number.toBN(s));

  return [
    number.toBN(constants.WEBAUTHN_CLS_HASH).toString(),
    "0",
    r0.toString(),
    r1.toString(),
    r2.toString(),
    s0.toString(),
    s1.toString(),
    s2.toString(),
    "9",
    "0",
    `${clientDataWords.length}`,
    `${clientDataJSONRem}`,
    ...clientDataWords.map((word) => `${word}`),
    `${authenticatorDataWords.length}`,
    `${authDataRem}`,
    ...authenticatorDataWords.map((word) => `${word}`),
  ];
}
