import AuthForm from "@/components/auth/AuthModal";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen justify-center">
      <AuthForm defaultMode="login" />
    </div>
  );
};

export default LoginPage;
