import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';

/**
 * The type definition for a user object.
 */
// export type User = {
// 	uid: string;
// 	role: string[] | string | null;
// 	data: {
// 		displayName: string;
// 		photoURL?: string;
// 		email?: string;
// 		shortcuts?: string[];
// 		settings?: Partial<FuseSettingsConfigType>;
// 		loginRedirectUrl?: string; // The URL to redirect to after login.
// 	};
// };

export type User = {
	
	id: string;
	role: string[] | string | null;
	name: string;
	email: string;
	firstName: string;
	surName: string;
	// name: string;
	// data: {
	// 	displayName: string;
	// 	photoURL?: string;
	// 	email?: string;
	// 	shortcuts?: string[];
	// 	settings?: Partial<FuseSettingsConfigType>;
	// 	loginRedirectUrl?: string; // The URL to redirect to after login.
	// };
};