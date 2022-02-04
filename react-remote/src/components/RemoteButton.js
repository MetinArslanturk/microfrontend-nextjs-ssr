import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

const Button = styled.button`
  background-color: #6497b1;
  border: none;
  color: white;
  padding: 5px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
`;

const RemoteButton = ({eventBus}) => {
  console.log("Remote-App (in remote) rendered");
  const [remoteCounter, setRemoteCounter] = useState(0);

    // Send message to parent && listen messages from parent
  useEffect(() => {
    let unsub;
    let messageTimeout;
    if (eventBus) {
      const callback = (name) => {
        console.log(`Hey I am child and I got a new message: ${name}!`);
      };
      unsub = eventBus.on("microAppParentEventsBus", callback);

      messageTimeout = setTimeout(() => {
        eventBus.publish("microAppChildEventsBus", "Oh, hey from child(remote) app");
      }, 2000);
    }
    return () => {
      unsub && unsub();
      messageTimeout && clearTimeout(messageTimeout);
    };
  }, []);
  return (
    <>
      <p>
        Remote Button counter: {remoteCounter}{" "}
        <Button onClick={() => setRemoteCounter((c) => c + 1)}>Increase</Button>
      </p>
    </>
  );
};
export default RemoteButton;
