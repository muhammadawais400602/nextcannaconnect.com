import { redirect } from "next/navigation";

export default function SignupsRedirect() {
  redirect("/admin/users");
}
