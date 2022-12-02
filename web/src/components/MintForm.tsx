import React, { useRef, useState, useEffect } from "react";
import useForm from "../hooks/useForm";
import useMint from "../hooks/useMint";
import { useETHAccounts } from "../hooks/useEthers";
import { hasKeys } from "../helpers/common"
import { DraftPatent, MintFormProps, HandleSubmitArgs} from "../types" 

const PatentFilingIdRegex = "[A-F]-[1-9]{5,7}/[A-Z]{5,9}"

const MintForm = ({ onSuccess } : MintFormProps) => {
  const accounts = useETHAccounts();
  const [mint] = useMint(accounts[0]);

	function validate (draft : DraftPatent): Boolean {
		// It has matched
		if (draft.patent_filed.patent_id.match(PatentFilingIdRegex) != null) {
			return true
		}

		return false
	}

	const handleFormSubmit = async ({values, errors} : HandleSubmitArgs ) => {
		if (hasKeys(errors)) {
			alert(`Failed validation: ${errors}`)
			return
		}

		let p = { researcher: values.researcher, university: values.university, patent_filed: { patent_id: values.patent_id, institution: values.institution }, cure: values.cure }

		// TODO would go into mind flow
		const isValid = validate(p)

		if (!isValid) {
			console.log("ERROR: Patent Filing Id failed regex test")
			alert("Invalid submission be sure to check all fields including the Patent Id matching the pattern A-12345/CURE")
			return
		}

		// TODO error handle 
		//
		const encryptedPayload = JSON.stringify(p)
		const metadata = {name: "Token", description: `This token can cure ${p.cure}`}
		const mintPayload = { content: encryptedPayload, metadata: metadata }

	  const elems = await mint(mintPayload);
		const token = elems![0] 
		const hash = elems![1]
		const secret = elems![2]

    onSuccess({ token, hash, key: secret });
	}

  // Default value is empty
  let initialValues = { 
		researcher: "1234",
		university: "1234",
		patent_id: "A-12345/CUREABC",
		institution: "1",
		cure: "test"
	};

  const { values, errors, handleChange, handleSubmit } =
    useForm({
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
      </div>
			<div>
				<form onSubmit={handleSubmit}>
					<div>
					 <label>Researcher</label>
						<input
							type="text"
							name="researcher"
							required
							onChange={handleChange}
							value={values.researcher}
						/>	

						<br/>
					 <label>University</label>
						<input
							type="text"
							name="university"
							required
							onChange={handleChange}
							value={values.university}
						/>	
						<br/>

					 <label>PatentId</label>
						<input
							type="text"
							name="patent_id"
							required
							onChange={handleChange}
							value={values.patent_id}
						/>	
						<br/>

					 <label>Institution</label>
						<input
							type="text"
							name="institution"
							required
							onChange={handleChange}
							value={values.institution}
						/>	
						<br/>

					 <label>Cure</label>
						<input
							type="text"
							name="cure"
							required
							onChange={handleChange}
							value={values.cure}
						/>	
						<br/>
						
						<button type="submit" style={{backgroundColor: "#2FF58E"}}>Finish</button>
					</div>
				</form>
			</div>
    </div>
  );
};

export default MintForm;
