export const typePublic = 'public'
export const typeUser = 'user'
export const typeScratch = 'scratch'
export const modelTypes = ['public', 'user', 'scratch']

export interface IExternalCompModModel {
	id: string
	name: string
	content: string
	domain: string
	type: string
	owner: string
	ownerName: string
	group: string
	createdAt: Date
    modifiedAt: Date
    annotations: Map<string,string>
}


