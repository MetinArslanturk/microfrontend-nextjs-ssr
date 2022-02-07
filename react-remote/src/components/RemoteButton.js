import React, { useState } from "react";
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

const RemoteButton = () => {
  console.log("Remote-App (in remote) rendered");
  const [remoteCounter, setRemoteCounter] = useState(0);



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
