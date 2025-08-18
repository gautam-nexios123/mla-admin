/**
 * The authRoles object defines the authorization roles for the Fuse application.
 */
const authRoles = {
	/**
	 * The admin role grants access to users with the 'admin' role.
	 */
	admin: ['ADMIN','SUPER_ADMIN','STAFF'],

	/**
	 * The staff role grants access to users with the 'admin' or 'staff' role.
	 */
	staff: ['SUPER_ADMIN','ADMIN','STAFF'],

	/**
	 * The user role grants access to users with the 'admin', 'staff', or 'user' role.
	 */
	user: ['SUPER_ADMIN','ADMIN','STAFF'],

	/**
	 * The onlyGuest role grants access to unauthenticated users.
	 */
	onlyGuest: []
};

export default authRoles;
