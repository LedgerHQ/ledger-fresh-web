import { waitFor, render, screen } from "@testing-library/react";
import * as erc20 from "@/services/token/erc20";
import { fireEvent } from "@testing-library/react";

import Home from "@/pages/index";

const pushMock = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@/services/token/erc20", () => ({
  __esModule: true,
  ...jest.requireActual("@/services/token/erc20"),
  fetchBalance: jest.fn().mockResolvedValue("10000000000000000"), // Provide your desired mock value here
}));

const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: jest.fn((key: string) => store[key]),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Home", () => {
  it("redirects to onboarding if no wallet", () => {
    render(<Home />);
    expect(pushMock).toHaveBeenCalledWith("/onboarding");
  });

  it("renders home if a wallet is present in localStorage ", async () => {
    setWallet();
    await waitFor(() => {
      render(<Home />);
    });
  });

  it("should display the amount of ethereum someone has", async () => {
    setWallet();
    const expectedValue = "0.01"; // Define the expected value

    render(<Home />);

    await waitFor(() => {
      expect(erc20.fetchBalance).toHaveBeenCalled(); // Verify that fetchBalance is called
    });

    const valueElement = await screen.findByText(expectedValue); // Wait for the element with the expected value to appear in the document

    expect(valueElement).toBeInTheDocument(); // Check if the element is in the document
  });
});

function setWallet() {
  localStorage.setItem(
    "fresh_account",
    JSON.stringify([
      {
        address:
          "0x5bb8286aac5616e8d56edb0448649b73c1809e0d299cef941f87d748411b1fc",
        authenticatorId: "z7NhE6Np-tyJM9KTW_I2PvD8yCwjkx3Ym7WBpFEvqGE",
        name: "Crema",
        networkId: "goerli-alpha",
      },
    ])
  );
}
