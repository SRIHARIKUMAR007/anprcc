
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthForm from "@/components/auth/AuthForm";
import RolePreview from "@/components/auth/RolePreview";
import AuthToggle from "@/components/auth/AuthToggle";
import RoleInfoSection from "@/components/auth/RoleInfoSection";
import { useAuthLogic } from "@/components/auth/useAuthLogic";

const Auth = () => {
  const {
    isLogin,
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    isLoading,
    handleAuth,
    handleToggleAuth
  } = useAuthLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            {isLogin ? "Sign In" : "Create Account"}
          </CardTitle>
          <p className="text-slate-400">
            {isLogin ? "Welcome back to ANPR Control Center" : "Join the ANPR Control Center"}
          </p>
        </CardHeader>
        <CardContent>
          <AuthForm
            isLogin={isLogin}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            fullName={fullName}
            setFullName={setFullName}
            isLoading={isLoading}
            onSubmit={handleAuth}
          />

          <RolePreview email={email} isLogin={isLogin} />

          <AuthToggle isLogin={isLogin} onToggle={handleToggleAuth} />

          <RoleInfoSection />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
