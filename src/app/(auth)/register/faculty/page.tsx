import { redirect } from "next/navigation";

export default function FacultyRegisterRedirect() {
  redirect("/register?role=faculty");
}
