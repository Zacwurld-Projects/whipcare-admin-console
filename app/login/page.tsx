import { LoginForm } from "@/app/components/auth/LoginForm";
import { AuthAside } from "@/app/components/auth/AuthAside";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <LoginForm />
      <AuthAside />
    </div>
  );
}
