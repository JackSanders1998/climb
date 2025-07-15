export enum Roles {
  USER = "USER",
  ADMIN = "ADMIN",
}

export const isAuthorized = (userRoles: string[], requiredRoles: Roles[]) => {
  return requiredRoles.every((role) => userRoles.includes(role));
};

export const hasRole = (userRoles: string[], role: Roles) => {
  return userRoles.includes(role);
};

export const isAdmin = (userRoles: string[]) => {
  return hasRole(userRoles, Roles.ADMIN);
};
