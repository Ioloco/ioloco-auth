import Image from "next/image";
import SignInForm from "@Components/Form/public/Signin";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left: Image */}
      <div className="relative hidden lg:block lg:w-2/3">
        <Image
          src="/image.webp"
          alt="Sign in cover"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right: Sign In Form (Client Component) */}
      <div className="flex w-full flex-col justify-center px-8 py-12 lg:w-1/3 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
