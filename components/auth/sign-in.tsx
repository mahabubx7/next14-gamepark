import { signIn } from "$/auth";
import { Button, Input } from "@nextui-org/react";
import { SlEnvolope, SlLock } from "react-icons/sl";

export async function SignIn() {
  "use server";

  return (
    <form
      className="flex flex-col gap-2 my-4"
      action={async (formData) => {
        "use server";
        await signIn("credentials", formData);
      }}
    >
      <Input
        name="email"
        type="email"
        labelPlacement="inside"
        isRequired
        placeholder="john@demo.com"
        startContent={<SlEnvolope />}
      />

      <Input
        name="password"
        type="pasword"
        labelPlacement="inside"
        isRequired
        placeholder="123456"
        startContent={<SlLock />}
      />

      <Button type="submit" color="default">
        Login
      </Button>
    </form>
  );
}

export function SignInWithGoogle() {
  return (
    <form
      className="m-2 rounded border border-blue-950 max-w-xs p-2 hover:border-blue-900 transition"
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button type="submit">Signin with Google</button>
    </form>
  );
}
