import { redirect } from "next/navigation";

// Single sign-in page for vendors: /signin (has "Forgot password").
export default function VendorLoginRedirect() {
  redirect("/signin");
}
