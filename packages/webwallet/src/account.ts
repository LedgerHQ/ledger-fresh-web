import { ChildApi } from "./connection";
import type { AsyncMethodReturns } from "penpal";
import {
  Abi,
  Account,
  AccountInterface,
  AllowArray,
  Call,
  InvocationsDetails,
  InvokeFunctionResponse,
  ProviderInterface,
  Signature,
  SignerInterface,
  typedData,
} from "starknet";

class UnimplementedSigner implements SignerInterface {
  async getPubKey(): Promise<string> {
    throw new Error("Method not implemented");
  }

  async signMessage(): Promise<Signature> {
    throw new Error("Method not implemented");
  }

  async signTransaction(): Promise<Signature> {
    throw new Error("Method not implemented");
  }

  async signDeclareTransaction(): Promise<Signature> {
    throw new Error("Method not implemented");
  }

  async signDeployAccountTransaction(): Promise<Signature> {
    throw new Error("Method not implemented");
  }
}

export class MessageAccount extends Account implements AccountInterface {
  public signer = new UnimplementedSigner();

  constructor(
    provider: ProviderInterface,
    public address: string,
    private readonly child: AsyncMethodReturns<ChildApi>
  ) {
    super(provider, address, new UnimplementedSigner());
  }

  execute(
    calls: AllowArray<Call>,
    abis?: Abi[] | undefined,
    transactionsDetail?: InvocationsDetails | undefined
  ): Promise<InvokeFunctionResponse> {
    return this.child.execute(calls, abis, transactionsDetail);
  }

  signMessage(typedData: typedData.TypedData): Promise<Signature> {
    return this.child.signMessage(typedData);
  }
}
