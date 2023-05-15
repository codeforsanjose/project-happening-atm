import parseJwt from "./parseJwt";
import LocalStorageTerms from "../constants/LocalStorageTerms";
import UserRoles from "../constants/UserRoles";

// returns true if the user is an admin
const isAdmin = () => {
  const token = localStorage.getItem(LocalStorageTerms.TOKEN);
  const parsedToken = parseJwt(token);
  return parsedToken && parsedToken.roles[0] === UserRoles.ADMIN;
};

export default isAdmin;
