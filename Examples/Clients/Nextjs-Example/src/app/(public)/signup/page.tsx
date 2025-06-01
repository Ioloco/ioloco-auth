import Image from "next/image";
import SignUpForm from "@Components/Form/public/Signup";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left: Image */}
      <div className="relative hidden lg:block lg:w-2/3">
        <Image
          src="/image.webp"
          alt="Sign up cover"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right: Sign Up Form */}
      <div className="flex w-full flex-col justify-center px-8 py-12 lg:w-1/3 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
