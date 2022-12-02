import React, { useState } from "react";
import { useETHAccounts } from "../hooks/useEthers";
import MintForm from "./MintForm";
import BrightlistForm from "./BrightlistForm";
import { Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function App() {
  const account = useETHAccounts()[0];
  const [success, setSuccess] = useState(false);
  const [key, setKey] = useState("???????");

  const onSuccess = (mintResult: any) => {
    console.log("Successfully minted token", mintResult);
    alert("Success your token was minted");
    alert(JSON.stringify({ token: mintResult.token }));

    localStorage.setItem("key", mintResult.key);
    setSuccess(true);
    setKey(mintResult.key);
  };

  const onBrightlistSuccess = (result: any) => {
    alert(`${result.modification} was successful`);
  };

  const copyToClipboard = async () => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(key);
    } else {
      return document.execCommand("copy", true, key);
    }
  };

  const handleCopy = () => {
    copyToClipboard()
      .then(() => {
        alert("Copied");
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  return (
    <Container>
      <div className="Web3App">
        <main>
          Your account: {account ? account : <p> No account </p>}
          <BrightlistForm onSuccess={onBrightlistSuccess} />
          <MintForm onSuccess={onSuccess} />
          <br />
          {success ? (
            <Form>
              <Form.Label>
                This is your encryption key to decrypt the payload
              </Form.Label>
              <Form.Control
                id="clipboard"
                disabled
                type="text"
                name="encryption"
                value={key}
              />
              <Button
                style={{ backgroundColor: "#2FF58E" }}
                onClick={handleCopy}
              >
                Copy
              </Button>
            </Form>
          ) : (
            <br />
          )}
        </main>
      </div>
    </Container>
  );
}

export default App;
