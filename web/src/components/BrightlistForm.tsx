
import React, { useRef, useState, useEffect } from "react";
import useForm from "../hooks/useForm";
import { useETHAccounts } from "../hooks/useEthers";
import { useModifyBrightlist } from "../hooks/useBrightlist";

const BrightlistForm = ({ onSuccess } : any) => {
  const accounts = useETHAccounts();
	const [brightlistRequest] = useModifyBrightlist()

	const handleAddSubmit = async ({values, errors} : any) => {
		console.log(values.addOrRemove)
		console.log(values.addOrRemove.toLowerCase() == 'add')

		if (values.addOrRemove.toLowerCase() == 'add' || values.addOrRemove.toLowerCase() == 'remove') {
			const response = await brightlistRequest({modification: values.addOrRemove, address: values.address})

			console.log("Success:", response)
		} else {
			alert("Bad operation, please use ADD or REMOVE")
			return
		}

    onSuccess({ modification: values.addOrRemove.toLowerCase() });
	}


  // Default value is empty
  let initialValues = { 
		address: "",
		addOrRemove: ""
	};

  const { values, errors, handleChange, handleSubmit } =
    useForm({
      initialValues,
      onSubmit: handleAddSubmit,
    });

  return (
		<div>
			<h1>Brightlist Form</h1>
      <div className="submit-result">
      </div>
			<div>
				<form onSubmit={handleSubmit}>
					<div>
					 <label>Address to brightlist</label>
						<input
							type="text"
							name="address"
							required
							onChange={handleChange}
							value={values.address}
						/>	

						<br/>
						<label>Add or remove (type)</label>

						<input
							type="text"
							required
							name="addOrRemove"
							onChange={handleChange}
							value={values.addOrRemove}
						/>	

						<br/>
						
						<button type="submit" style={{backgroundColor: "#2FF58E"}}>Run</button>
					</div>
				</form>
			</div>
    </div>
  );
};

export default BrightlistForm
