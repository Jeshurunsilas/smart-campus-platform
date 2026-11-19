import { redirect } from "next/navigation";

export default function StudentRegisterRedirect() {
  redirect("/register?role=student");
}
