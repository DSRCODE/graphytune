import React from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

const WelcomePage = () => {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#001F54",
        flexDirection:"column"
      }}
    >
      <Title
        level={2}
        style={{ color: "#001F54", textAlign: "center", fontSize: 40 }}
      >
        Welcome to Graphytune Admin Dashboard
      </Title>
      <Text style={{ color: "#94A3B8", fontSize:16 }}>
        Monitor your community, moderate content, and track performance from one
        place.
      </Text>
    </div>
  );
};

export default WelcomePage;
