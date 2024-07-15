import { signOut } from "$/auth";
import { Button } from "@nextui-org/react";

interface SignOutProps {
  raw: boolean;
}

export function SignOut(
  props: SignOutProps = {
    raw: false,
  }
) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      {props.raw ? (
        <button type="submit">Sign Out</button>
      ) : (
        <Button size="sm" type="submit">
          Sign Out
        </Button>
      )}
    </form>
  );
}
