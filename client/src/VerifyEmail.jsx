import { useEffect, useState } from "react";
import useQueryParams from "./useQueryParams";
import axios from "axios";

export const VerifyEmail = () => {
  const [message, setMessage] = useState();
  const { token } = useQueryParams();
  useEffect(() => {
    const controller = new AbortController();

    if (token) {
      axios
        .post(
          "/users/verify-email", // URL xác thực email bên API Server
          { email_verify_token: token },
          {
            baseURL: import.meta.env.VITE_API_URL,
            signal: controller.signal,
          }
        )
        .then((res) => {
          setMessage(res.data.message);
          if (res.data.data) {
            const { refresh_token, access_token } = res.data.data;
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
          }
        })
        .catch((err) => {
          setMessage(err.response.data.message);
        });
    }
    return () => {
      controller.abort();
    };
  }, [token]);
  return <div>{message}</div>;
};
