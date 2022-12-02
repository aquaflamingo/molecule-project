import React, { useRef, useState, useEffect } from "react";
import useForm from "../hooks/useForm";
import useMint from "../hooks/useMint";
import { useETHAccounts } from "../hooks/useEthers";
import { hasKeys } from "../helpers/common";
import { DraftPatent, MintFormProps, HandleSubmitArgs } from "../types";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const PatentFilingIdRegex = "[A-F]-[1-9]{5,7}/[A-Z]{5,9}";

const MintForm = ({ onSuccess }: MintFormProps) => {
  const accounts = useETHAccounts();
  const [mint] = useMint(accounts[0]);

  function validate(draft: DraftPatent): Boolean {
    // It has matched
    if (draft.patent_filed.patent_id.match(PatentFilingIdRegex) != null) {
      return true;
    }

    return false;
  }

  const handleFormSubmit = async ({ values, errors }: HandleSubmitArgs) => {
    if (hasKeys(errors)) {
      alert(`Failed validation: ${errors}`);
      return;
    }

    let p = {
      researcher: values.researcher,
      university: values.university,
      patent_filed: {
        patent_id: values.patent_id,
        institution: values.institution,
      },
      cure: values.cure,
    };

    // TODO would go into mind flow
    const isValid = validate(p);

    if (!isValid) {
      console.log("ERROR: Patent Filing Id failed regex test");
      alert(
        "Invalid submission be sure to check all fields including the Patent Id matching the pattern A-12345/CURE"
      );
      return;
    }

    // TODO error handle
    //
    const encryptedPayload = JSON.stringify(p);
    const metadata = {
      name: "Token",
      description: `This token can cure ${p.cure}`,
    };
    const mintPayload = { content: encryptedPayload, metadata: metadata };

    const result = await mint(mintPayload);
    const [token, hash, secret, err, brightlist] = result;

    if (err) {
      console.error("Could not mint token:", err);

      if (brightlist) {
        alert(
          "failed to mint because you are not brightlisted. please brightlist yourself then try again"
        );
      } else {
        alert("mint failed for unknown reason check console");
      }
    } else {
      onSuccess({ token, hash, key: secret });
    }
  };

  // Default value is empty
  let initialValues = {
    researcher: "1234",
    university: "1234",
    patent_id: "A-12345/CUREABC",
    institution: "1",
    cure: "test",
  };
  const l = 9;

  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues,
    onSubmit: handleFormSubmit,
  });

  // {result.isLoading ? "Loading..." : ""}
  // {result.data ? result.data.msg : ""}
  // {result.error ? result.error : ""}
  return (
    <div>
      <h1>Mint Form</h1>
      <div className="submit-result">
        <small>
          Note that you can only mint 1 token at a time. Any subsequent mints
          will remove you from the brightlist and will require that you re-add
          yourself. The owner of the contract is the first signer in metamask if
          you deployed via hardhat
        </small>
      </div>
      <div>
        <Form onSubmit={handleSubmit}>
          <div>
            <Form.Label>Researcher</Form.Label>
            <Form.Control
              type="text"
              name="researcher"
              required
              onChange={handleChange}
              value={values.researcher}
            />

            <br />
            <Form.Label>University</Form.Label>
            <Form.Control
              type="text"
              name="university"
              required
              onChange={handleChange}
              value={values.university}
            />
            <br />

            <Form.Label>PatentId</Form.Label>
            <Form.Control
              type="text"
              name="patent_id"
              required
              onChange={handleChange}
              value={values.patent_id}
            />
            <br />

            <Form.Label>Institution</Form.Label>
            <Form.Control
              type="text"
              name="institution"
              required
              onChange={handleChange}
              value={values.institution}
            />
            <br />

            <Form.Label>Cure</Form.Label>
            <Form.Control
              type="text"
              name="cure"
              required
              onChange={handleChange}
              value={values.cure}
            />
            <br />

            <Button type="submit" style={{ backgroundColor: "#2FF58E" }}>
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default MintForm;
