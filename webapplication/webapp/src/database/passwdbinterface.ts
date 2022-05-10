export interface IExternalPasswordUser {
	id: string
	name: string
	email: string
	group: string
	accessibleGroups: string[]
	isGuest: boolean
	isAdmin: boolean
	createdAt: Date
}

export interface IExternalAccessGroup {
	id: string
	name: string
	accessCode: string
}
