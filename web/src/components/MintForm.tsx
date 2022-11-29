import React, { useRef, useState, useEffect } from "react";
import useForm from "../hooks/useForm";
import useMint from "../hooks/useMint";
import { useETHAccounts } from "../hooks/useEthers";
import { hasKeys } from "../helpers/common"
import { DraftPatent, MintFormProps, HandleSubmitArgs} from "../types" 

const PatentFilingIdRegex = "[A-F]-[1-9]{5,7}\\/[A-Z]{5,9}"

const MintForm = ({ onSuccess } : MintFormProps) => {
  const accounts = useETHAccounts();
  const [{ data, isLoading, error }, mint] = useMint(accounts[0]);


	function validate (draft : DraftPatent): Boolean {
		if (!draft.patent_filed.patent_id.match(PatentFilingIdRegex)) {
			return false
		}

		return true
	}

	const handleFormSubmit = async ({values, errors} : HandleSubmitArgs ) => {
		if (hasKeys(errors)) {
			alert(`Failed validation: ${errors}`)
			return
		}

		let p = { researcher: values.researcher, university: values.university, patent_filed: { patent_id: values.patent_id, institution: values.institution } }

		// TODO would go into mind flow
		const isValid = validate(p)

		if (!isValid) {
			console.log("ERROR: Patent Filing Id failed regex test")
			alert("Invalid submission be sure to check all fields including the Patent Id matching the pattern A-12345/CURE")
			return
		}

		console.log(values)
	}

  // const onMint = async ({ values, errors }) => {
		// // TODO
    // // Trigger failure modal if any errors
    // if (hasKeys(errors)) onFailure(errors);
    //
    // console.log("MintForm.onMint: ", values, errors);
    //
    // const record = drafteds.find(
    //   (r) => r.id === parseInt(values.recordId)
    // );
    //
    // const mintPayload = { data: record, content: md.fp };
    //
    // const [token, hash] = await mint(mintPayload);
    //
    // onSuccess({ token, hash });
  // };

  // Default value is empty
  let initialValues = { 
		researcher: "",
		university: "",
		patent_id: "",
		institution: ""
	};

  const { values, errors, handleChange, handleSubmit } =
    useForm({
      initialValues,
      onSubmit: handleFormSubmit,
    });

  return (
		<div>
			<h1>Mint Form</h1>
      <div className="submit-result">
        // {isLoading ? "Loading..." : ""}
        // {data ? data.msg : ""}
        // {error ? error : ""}
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

					 <label>University</label>
						<input
							type="text"
							name="university"
							required
							onChange={handleChange}
							value={values.university}
						/>	

					 <label>PatentId</label>
						<input
							type="text"
							name="patent_id"
							required
							onChange={handleChange}
							value={values.patent_id}
						/>	

					 <label>Institution</label>
						<input
							type="text"
							name="institution"
							required
							onChange={handleChange}
							value={values.institution}
						/>	
						
						<button type="submit" style={{backgroundColor: "#2FF58E"}}>Finish</button>
					</div>
				</form>
			</div>
    </div>
  );
};

export default MintForm;
