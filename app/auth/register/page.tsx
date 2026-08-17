import AuthForm from "@/components/auth/AuthModal";

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen justify-center">
      <AuthForm defaultMode="register" />
    </div>
  );
};

export default RegisterPage;
