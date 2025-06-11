import Cookies from "js-cookie";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const logout = (router: AppRouterInstance) => {
  Cookies.remove("access_token");
  localStorage.removeItem("user");
  // Redirect to the login page
  router.push("/login");
};
