import { Link } from "react-router-dom";
import viteLogo from "../public/vite.svg";
import reactLogo from "./assets/react.svg";
import "@vidstack/react/player/styles/base.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";

console.log(import.meta.env);
const getGoogleAuthUrl = () => {
  const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_REDIRECT_URI } = import.meta.env;
  const url = `https://accounts.google.com/o/oauth2/v2/auth`;
  const query = {
    client_id: VITE_GOOGLE_CLIENT_ID,
    redirect_uri: VITE_GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    prompt: "consent",
    access_type: "offline",
  };
  const queryString = new URLSearchParams(query).toString();
  return `${url}?${queryString}`;
};
const googleOAuthUrl = getGoogleAuthUrl();

export const Home = () => {
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.reload();
  };
  return (
    <>
      <div>
        <span>
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </span>
        <span>
          <img src={reactLogo} className="logo react" alt="React logo" />
        </span>
      </div>
      <h1>Google OAuth 2.0</h1>
      <p className="read-the-docs">
        {isAuthenticated ? (
          <>
            <span>Hello my friend, you are logged in.</span>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to={googleOAuthUrl}>Login with Google</Link>
        )}
      </p>
      <h2>Video Streaming</h2>
      <video controls width={500}>
        <source
          src="https://twitter-bucket-2023.s3.ap-southeast-1.amazonaws.com/videos/UPfIUOCax9tM9LbCqSYFu.mp4"
          type="video/mp4"
        />
      </video>
      <h2>HLS Streaming</h2>
      <MediaPlayer
        title="Sprite Fight"
        src="http://localhost:3000/static/video-hls/sJUEfqaEq_tJjZere2Yaf/master.m3u8"
      >
        <MediaProvider />
      </MediaPlayer>
    </>
  );
};
