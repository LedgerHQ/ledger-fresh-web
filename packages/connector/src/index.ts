import { Connector, EventHandler } from "@starknet-react/core";
import getWebWalletStarknetObject from "fresh-webwallet";
import { AccountInterface, InvokeFunctionResponse } from "starknet";
import type { StarknetWindowObject } from "get-starknet";

class ControllerConnector extends Connector {
  private _account: AccountInterface | null;
  private _frame: StarknetWindowObject | null;

  constructor(options?: { url?: string; origin?: string }) {
    super({ options });
    this._account = null;
    this._frame = null;
    getWebWalletStarknetObject().then((iframe) => (this._frame = iframe));
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
    this._frame = await getWebWalletStarknetObject();
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

  account() {
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
