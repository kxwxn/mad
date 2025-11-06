import { SignIn } from "@clerk/nextjs";

export default function AdminSignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6">
        <SignIn 
          signUpUrl="/admin/sign-up"
          redirectUrl="/admin/dashboard"
          routing="path"
          path="/admin/sign-in"
          forceRedirectUrl="/admin/dashboard"
        />
      </div>
    </div>
  );
}
