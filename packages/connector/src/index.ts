import { Connector, EventHandler } from "@starknet-react/core";
import getWebWalletStarknetObject from "fresh-webwallet";
import { AccountInterface, InvokeFunctionResponse } from "starknet";
import type { StarknetWindowObject } from "get-starknet";

class ControllerConnector extends Connector {
  private _account: AccountInterface | null;
  private _frame: StarknetWindowObject | null;

  constructor(options?: { url?: string; show?: boolean }) {
    super({ options });
    this._account = null;
    this._frame = null;
    getWebWalletStarknetObject(options)
      .then((iframe) => {
        this._frame = iframe;
      })
      .catch((error) => console.error(error));
  }

  icon() {
    return "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMTQ5LjA0IDEwNDkuNDciIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDExNDkuMDQgMTA0OS40NzsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8cmVjdCBjbGFzcz0ic3QwIiB3aWR0aD0iMTE0OS4wNCIgaGVpZ2h0PSIxMDQ5LjQ3Ii8+CjxwYXRoIGQ9Ik0xOTAuMDYsNjY5LjM1djE5MC4wNmgyODkuMjJ2LTQyLjE0SDIzMi4yMVY2NjkuMzVIMTkwLjA2eiBNOTE2LjgzLDY2OS4zNXYxNDcuOTJINjY5Ljc1djQyLjE0aDI4OS4yMlY2NjkuMzVIOTE2LjgzegoJIE00NzkuNywzODAuMTJ2Mjg5LjIyaDE5MC4wNXYtMzguMDFINTIxLjg0VjM4MC4xMkg0NzkuN3ogTTE5MC4wNiwxOTAuMDZ2MTkwLjA2aDQyLjE0VjIzMi4yMWgyNDcuMDh2LTQyLjE0SDE5MC4wNnoKCSBNNjY5Ljc1LDE5MC4wNnY0Mi4xNGgyNDcuMDh2MTQ3LjkyaDQyLjE0VjE5MC4wNkg2NjkuNzV6Ii8+Cjwvc3ZnPgo=";
  }

  id() {
    return "fresh";
  }

  name() {
    return "Fresh";
  }

  available(): boolean {
    return true;
  }

  async ready() {
    return true;
  }

  async connect(): Promise<AccountInterface> {
    if (!this._frame) {
      throw new Error("iframe not found");
    }
    await this._frame.enable();
    if (this._frame.account) {
      this._account = this._frame.account;
    }
    if (!this._account) {
      throw new Error("account not found");
    }
    return this._account;
  }

  async disconnect(): Promise<void> {
    this._account = null;
    return;
  }

  async account() {
    return Promise.resolve(this._account);
  }

  initEventListener(accountChangeCb: EventHandler): Promise<void> {
    // TODO
    return Promise.resolve();
  }

  removeEventListener(accountChangeCb: EventHandler): Promise<void> {
    // TODO
    return Promise.resolve();
  }
}

export default ControllerConnector;
