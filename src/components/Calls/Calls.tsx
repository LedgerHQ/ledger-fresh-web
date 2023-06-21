import styles from "./Calls.module.css";
import { constants as starknetConstant, Call, number } from "starknet";
import { useState } from "react";
import Image from "next/image";

interface Props {
  calls: Call[];
}

const shorten = (data: string) => {
  const maxLength = 40;
  if (data.length > maxLength) {
    return `${data.substring(0, 14)}...${data.substring(data.length - 14)}`;
  }
  return data;
};

export function Calls({ calls, ...props }: Props) {
  return (
    <>
      {calls.map((call, index) => {
        const [isOpen, setIsOpen] = useState(false);

        console.log(call);
        if (call.entrypoint === "approve") {
          return (
            <div key={index}>
              <h4 style={{ display: "flex" }}>
                Action: {call.entrypoint}
                <Image
                  src="/Icons/chevron-old-down.svg"
                  alt="back"
                  width={16}
                  height={14}
                  priority
                  onClick={() => setIsOpen(!isOpen)}
                />
              </h4>
              {isOpen && (
                <div>
                  <div> contract: {shorten(call.contractAddress)}</div>
                  <div>
                    to:{" "}
                    {shorten(
                      number.toHex(number.toBN(call?.calldata?.[0] || 0))
                    )}
                  </div>
                  <div>amount: {call.calldata?.[1]?.toString()}</div>
                </div>
              )}
            </div>
          );
        } else if (call.entrypoint === "transfer") {
          return (
            <div key={index}>
              <h4>Action: {call.entrypoint}</h4>
              <div>
                To{" "}
                {shorten(number.toHex(number.toBN(call?.calldata?.[0] || 0)))}
              </div>
              <div>Amount {call.calldata?.[1]?.toString()}</div>
            </div>
          );
        } else {
          return (
            <div key={index}>
              <h4 style={{ display: "flex" }}>
                Action: {call.entrypoint}
                <Image
                  src="/Icons/chevron-old-down.svg"
                  alt="back"
                  width={16}
                  height={14}
                  priority
                  onClick={() => setIsOpen(!isOpen)}
                />
              </h4>
              {isOpen && (
                <ul>
                  {call.calldata?.map((data, i) => (
                    <li key={i}>{shorten(data.toString())}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        }
      })}
    </>
  );
}
