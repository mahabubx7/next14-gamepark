"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface NotifyForbiddenProps {
  title?: string;
  bypass?: {
    type: "redirect" | "callback" | "none";
  };
}

export function NotifyForbidden({ title, bypass }: NotifyForbiddenProps) {
  // "use client";

  const router = useRouter();

  toast.error(title || "Forbidden resource!", {
    icon: "🔒",
    style: {
      background: "rgba(234, 28, 28, 0.2)",
      color: "#e92424",
    },
    position: "bottom-right",
  });

  if (bypass && bypass.type === "redirect") {
    setInterval(() => {
      router.push("/login");
    }, 300);
  }

  return <></>;
}
