// components/GoogleSignInButton.js
import { auth } from "@/app/firebaseConfig";
import { setCookie } from "@/utils/cookies";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";

const GoogleSignInButton = () => {
  const router = useRouter();
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result:any = await signInWithPopup(auth, provider);
      if (result) {
        router.push("/");
        setCookie("accessToken", result.user.accessToken, 7);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="bg-blue-900/[0.8] text-sm tracking-wider text-center font-semibold rounded-md px-12 py-3 w-full element-hover"
      onClick={signInWithGoogle}
    >
      <button>Login with Google</button>
    </div>
  );
};

export default GoogleSignInButton;
