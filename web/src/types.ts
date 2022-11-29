export type MintFormProps = {
	onSuccess : () => void
}

export type HandleSubmitArgs = {
	values: any
	errors: any
}

export type PatentFiled = {
	patent_id: string
	institution: string
}

export type DraftPatent = {
		researcher: string
		university: string
		patent_filed: PatentFiled
}

export type UploadData = {
	draft: DraftPatent
}

export type IPFSUploadArgs = {
	// FIXME: Blob
	content: string
	data: UploadData
}
