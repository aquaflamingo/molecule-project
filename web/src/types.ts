export type MintFormProps = {
	onSuccess : (result : any) => void
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

// Token XYZ 
// This token can cure XYZ
export type UploadMetaData = {}

export type IPFSUploadArgs = {
	// FIXME: Encrypted blob
	content: string
	metadata: UploadMetaData
}
