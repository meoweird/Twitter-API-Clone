import { useEffect, useState } from "react";
import useQueryParams from "./useQueryParams";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const VerifyForgotPasswordToken = () => {
  const [message, setMessage] = useState("");
  const { token } = useQueryParams();
  const navigate = useNavigate();
  useEffect(() => {
    const controller = new AbortController();

    if (token) {
      axios
        .post(
          "/users/verify-forgot-password", // URL xác thực token forgot password bên API Server
          { forgot_password_token: token },
          {
            baseURL: import.meta.env.VITE_API_URL,
            signal: controller.signal,
          }
        )
        .then(() => {
          navigate("/reset-password", {
            state: { forgot_password_token: token },
          });
        })
        .catch((err) => {
          setMessage(err.response.data.message);
        });
    }
    return () => {
      controller.abort();
    };
  }, [token, navigate]);
  return <div>{message}</div>;
};
