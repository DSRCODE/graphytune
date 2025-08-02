import React from "react";
import { Card, Row, Col } from "antd";
import {
  DollarCircleOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import "../Styles/Dashboard.css";
import {
  BarChartWidget,
  LineChartWidget,
  PieChartWidget,
} from "../components/ChartWidgets/LineChartWidget";
import { useTranslation } from "react-i18next";

const lineData = [
  { label: "Mon", value: 1200 },
  { label: "Tue", value: 1800 },
  { label: "Wed", value: 2000 },
  { label: "Thu", value: 2500 },
  { label: "Fri", value: 3100 },
];

const pieData = [
  { name: "Grocery", value: 400 },
  { name: "Electronics", value: 300 },
  { name: "Fashion", value: 300 },
];
const pieColors = ["#1890ff", "#fa8c16", "#52c41a"];

const barData = [
  { name: "Vendor A", total: 2400 },
  { name: "Vendor B", total: 1398 },
  { name: "Vendor C", total: 9800 },
  { name: "Vendor D", total: 3900 },
];

const barColors = ["#722ed1", "#13c2c2", "#fa541c", "#52c41a"];

export default function Dashboard() {
  const { t } = useTranslation();
  const metrics = [
    {
      title: "Total Revenue",
      value: "₹1,20,000",
      icon: <DollarCircleOutlined className="dashboard-icon" />,
      backgroundColor: "#e6f7e6",
      iconBg: "#52c41a",
      textColor: "#1a1a1a",
    },
    {
      title: "Active Users",
      value: "1,345",
      icon: <UserOutlined className="dashboard-icon" />,
      backgroundColor: "#e6f4ff",
      iconBg: "#1890ff",
      textColor: "#1a1a1a",
    },
    {
      title: "Orders Today",
      value: "320",
      icon: <ShoppingCartOutlined className="dashboard-icon" />,
      backgroundColor: "#fff7e6",
      iconBg: "#faad14",
      textColor: "#1a1a1a",
    },
    {
      title: "Growth Rate",
      value: "12.5%",
      icon: <LineChartOutlined className="dashboard-icon" />,
      backgroundColor: "#fff0f6",
      iconBg: "#eb2f96",
      textColor: "#1a1a1a",
    },
  ];

  return (
    <>
      <div className="dashboard-container">
        <h2 className="dashboard-title">{t("welcome")}</h2>
        <Row gutter={[16, 16]}>
          {metrics.map((metric, index) => (
            <Col key={index} xs={24} sm={12} md={12} lg={6}>
              <Card
                className="dashboard-card"
                bordered={false}
                style={{ backgroundColor: metric.backgroundColor }}
              >
                <div className="dashboard-card-body">
                  <div
                    className="dashboard-icon-wrapper"
                    style={{ backgroundColor: metric.iconBg, color: "#fff" }}
                  >
                    {metric.icon}
                  </div>
                  <div>
                    <h4
                      className="dashboard-metric-title"
                      style={{ color: metric.textColor }}
                    >
                      {metric.title}
                    </h4>
                    <p
                      className="dashboard-metric-value"
                      style={{ color: metric.textColor }}
                    >
                      {metric.value}
                    </p>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div>
        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          <Col xs={24} lg={12}>
            <LineChartWidget
              title="Weekly Revenue Trend"
              data={lineData}
              dataKey="value"
            />
          </Col>
          <Col xs={24} lg={12}>
            <BarChartWidget
              title="Top Vendors"
              data={barData}
              dataKey="total"
              labelKey="name"
              colors={barColors}
            />
          </Col>
          <Col xs={24} lg={12}>
            <PieChartWidget
              title="Weekly Orders Placed"
              data={pieData}
              dataKey="value"
              nameKey="name"
              colors={pieColors}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}
