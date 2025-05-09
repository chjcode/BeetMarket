import React from "react";
import { useNavigate } from "react-router-dom";
import beetsad from "./beetsad.png";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      background: "#F3D6F7",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      maxWidth: "480px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <img
        src={beetsad}
        alt="슬픈 비트"
        style={{ width: 180, height: 180, marginBottom: 32 }}
      />
      <div style={{ color: "#6B4A7C", fontSize: 20, marginBottom: 40 }}>
        페이지를 찾을 수 없습니다.
      </div>
      <button
        style={{
          background: "#A349A4",
          color: "white",
          border: "none",
          borderRadius: 8,
          padding: "12px 0",
          width: 240,
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer"
        }}
        onClick={() => navigate(-1)}
      >
        이전 페이지로 돌아가기
      </button>
    </div>
  );
};

export default NotFoundPage;
