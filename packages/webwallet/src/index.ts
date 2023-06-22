import type { StarknetWindowObject } from "./StarknetWindowObject";
import { createModal, getConnection } from "./connection";
import { getStarknetConnectedObject } from "./starknetObject";

async function getWebWalletStarknetObject(): Promise<StarknetWindowObject | null> {
  const globalWindow = typeof window !== "undefined" ? window : undefined;
  if (!globalWindow) {
    throw new Error("window is not defined");
  }
  const url_account: string = "http://localhost:3000/fresh";
  const icon =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMTQ5LjA0IDEwNDkuNDciIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDExNDkuMDQgMTA0OS40NzsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8cmVjdCBjbGFzcz0ic3QwIiB3aWR0aD0iMTE0OS4wNCIgaGVpZ2h0PSIxMDQ5LjQ3Ii8+CjxwYXRoIGQ9Ik0xOTAuMDYsNjY5LjM1djE5MC4wNmgyODkuMjJ2LTQyLjE0SDIzMi4yMVY2NjkuMzVIMTkwLjA2eiBNOTE2LjgzLDY2OS4zNXYxNDcuOTJINjY5Ljc1djQyLjE0aDI4OS4yMlY2NjkuMzVIOTE2LjgzegoJIE00NzkuNywzODAuMTJ2Mjg5LjIyaDE5MC4wNXYtMzguMDFINTIxLjg0VjM4MC4xMkg0NzkuN3ogTTE5MC4wNiwxOTAuMDZ2MTkwLjA2aDQyLjE0VjIzMi4yMWgyNDcuMDh2LTQyLjE0SDE5MC4wNnoKCSBNNjY5Ljc1LDE5MC4wNnY0Mi4xNGgyNDcuMDh2MTQ3LjkyaDQyLjE0VjE5MC4wNkg2NjkuNzV6Ii8+Cjwvc3ZnPgo=";

  const { iframe, modal } = await createModal(url_account, false);

  console.log(iframe);
  const connection = await getConnection({ iframe, modal });

  const starknetConnectedObject = getStarknetConnectedObject(
    {
      id: "fresh",
      icon: icon,
      name: "Fresh",
      version: "online",
    },
    connection
  );

  (window as any).starknet_fresh = starknetConnectedObject;
  return starknetConnectedObject;
}

export default getWebWalletStarknetObject;
