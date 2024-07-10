import toast from "react-hot-toast";

const API_URL = `${
  process.env.ORIGIN ? process.env.ORIGIN! : "http://localhost:3000"
}/api`;

/**
 * Fetch data from the API
 * @param url Endpoint of your API route
 * @param options Raw options to be passed to fetch
 * @returns Response from the API or an (rejected) error
 */
export async function get<T = any>(
  url: string,
  options: Record<string, any> = {}
) {
  const res = await fetch(API_URL + url, {
    headers: {
      "Content-Type": "application/json",
    }, // default headers
    ...options, // merge/update - incoming options
  });

  if (!res.ok) {
    if (options.toastOnError) {
      toast.error(`Error ${res.status} : ${res.statusText}`, {
        style: {
          background: "rgba(235, 56, 56, 0.1)",
          color: "#c14005",
        },
        icon: "❌",
        position: "bottom-right",
      });
    }

    Promise.reject(res.statusText);
  }

  return res.json() as Promise<T>;
}

/**
 * Post data to the API
 * @param url Endpoint of your API route
 * @param options Raw options to be passed to fetch
 * @returns Response from the API or an (rejected) error
 */
export async function post<T = any>(
  url: string,
  options: Record<string, any> = {},
  origin?: string
) {
  const res = await fetch(`${origin ? origin + "/api" : API_URL}${url}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin": "*",
    }, // default headers
    ...options, // merge/update - incoming options
  });

  if (!res.ok) {
    if (options.toastOnError) {
      toast.error(`Error ${res.status} : ${res.statusText}`, {
        style: {
          background: "rgba(235, 56, 56, 0.1)",
          color: "#c14005",
        },
        icon: "❌",
        position: "bottom-right",
      });
    }

    Promise.reject(res.statusText);
  }

  if (options.toastOnSuccess) {
    toast.success(options.onSuccessMsg || "Request accepted!", {
      duration: 3000,
      icon: "✅",
      position: "bottom-right",
      style: {
        background: "rgba(56, 235, 116, 0.1)",
        color: "#05c140",
      },
    });
  }

  return res.json() as Promise<T>;
}
