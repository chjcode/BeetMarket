import React from "react";
import { useNavigate } from "react-router-dom";
import beetsad from "@/shared/assets/beetsad.png";
import Button from "@/shared/ui/Button/Button";

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
      <Button
        width="240px"
        label="이전 페이지로 돌아가기"
        onClick={() => navigate(-1)}
      />
    </div>
  );
};

export default NotFoundPage;
