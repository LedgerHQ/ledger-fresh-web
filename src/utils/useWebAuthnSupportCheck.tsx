import { useState, useEffect } from "react";

type Details = {
  publicKeyCredentialSupport: boolean;
  navigatorSupport: boolean;
  navigatorCredentialsSupport: boolean;
  navigatorCredentialsCreateSupport: boolean;
  navigatorCredentialsGetSupport: boolean;
};

type Support = {
  isSupported: boolean;
  details: Partial<Details>;
};

/*  check if webauthn is supported in the context the app is loaded
    if it's not the case, return the details */
const useWebAuthnSupportCheck = (): [
  Support["isSupported"],
  Support["details"]
] => {
  const [support, setSupport] = useState<Support>({
    isSupported: false,
    details: {},
  });

  useEffect(() => {
    // check the support of all required API for WebAuthn
    const details: Details = {
      publicKeyCredentialSupport: !!window?.PublicKeyCredential,
      navigatorSupport: !!window?.navigator,
      navigatorCredentialsSupport: !!window?.navigator?.credentials,
      navigatorCredentialsCreateSupport:
        !!window?.navigator?.credentials?.create,
      navigatorCredentialsGetSupport: !!window?.navigator?.credentials?.get,
    };

    // check if all the APIs are supported
    const isSupported = Object.values(details).every((value) => value === true);

    // store the details
    setSupport({ isSupported, details });
  }, []);

  return [support.isSupported, support.details];
};

export default useWebAuthnSupportCheck;
