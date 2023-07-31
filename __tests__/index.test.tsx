import { waitFor, render, screen, act } from "@testing-library/react";
import * as erc20 from "@/services/token/erc20";
import { fireEvent } from "@testing-library/react";
import { NotificationContext } from "@/services/notificationProvider";
import { AccountProvider } from "@/services/accountStorage/AccountContext";

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
    render(
      <AccountProvider>
        <Home />
      </AccountProvider>
    );
    expect(pushMock).toHaveBeenCalledWith("/onboarding");
  });

  it("renders home if a wallet is present in localStorage ", async () => {
    setWallet();
    await waitFor(() => {
      render(
        <AccountProvider>
          <Home />
        </AccountProvider>
      );
    });
  });

  it("should display the amount of ethereum someone has", async () => {
    setWallet();
    const expectedValue = "0.01"; // Define the expected value

    render(
      <AccountProvider>
        <Home />
      </AccountProvider>
    );

    await waitFor(() => {
      expect(erc20.fetchBalance).toHaveBeenCalled(); // Verify that fetchBalance is called
    });

    const valueElement = await screen.findByText(expectedValue); // Wait for the element with the expected value to appear in the document

    expect(valueElement).toBeInTheDocument(); // Check if the element is in the document
  });

  it("renders Fund and Send buttons when a wallet is present", async () => {
    setWallet();
    await waitFor(() => {
      render(
        <AccountProvider>
          <Home />
        </AccountProvider>
      );
    });
    const fundButton = screen.getByText("Fund");
    const sendButton = screen.getByText("Send");

    expect(fundButton).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
  });

  it("calls requestFund function when Fund button is clicked", async () => {
    setWallet();
    await waitFor(() => {
      render(
        <AccountProvider>
          <Home />
        </AccountProvider>
      );
    });
    const fundButton = screen.getByText("Fund");
    const requestFundSpy = jest
      .spyOn(window, "fetch")
      .mockImplementationOnce(() =>
        Promise.resolve(
          new Response(JSON.stringify({ transaction_hash: "sample_hash" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
        )
      );

    fireEvent.click(fundButton);

    await waitFor(() => {
      expect(requestFundSpy).toHaveBeenCalled();
    });

    requestFundSpy.mockRestore();
  });

  // Update the tests
  it("sets notification correctly when a successful fund request is made", async () => {
    setWallet();
    const setNotificationMock = jest.fn();

    const requestFundSpy = jest
      .spyOn(window, "fetch")
      .mockImplementationOnce(() =>
        Promise.resolve(
          new Response(JSON.stringify({ transaction_hash: "sample_hash" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
        )
      );

    await act(async () => {
      render(
        <NotificationContext.Provider
          value={{
            notification: {},
            setNotification: setNotificationMock,
          }}
        >
          <AccountProvider>
            <Home />
          </AccountProvider>
        </NotificationContext.Provider>
      );
    });
    const fundButton = screen.getByText("Fund");

    fireEvent.click(fundButton);

    await waitFor(() => {
      expect(requestFundSpy).toHaveBeenCalled();
      expect(setNotificationMock).toHaveBeenCalled();
    });
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
  localStorage.setItem(
    "selected_account",
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
