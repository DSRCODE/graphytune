import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Descriptions, Tag } from "antd";
import { getStatusColor } from "../../../Utills/Utills";

const mockVendorData = {
  1: {
    fullname: "Rajesh Kumar",
    age: 35,
    gender: "Male",
    email: "rajesh@example.com",
    phone: "+91 9876543210",
    type: "Seller",
    date: "2025-05-01",
    shopName: "Rajesh Electronics",
    shopCert:
      "https://img.freepik.com/free-vector/free-delivery-logo-with-bike-man-courier_1308-48827.jpg?semt=ais_hybrid&w=740",
    status: "Active",
  },
  2: {
    fullname: "Anita Sharma",
    age: 29,
    gender: "Female",
    email: "anita@example.com",
    phone: "+91 9123456789",
    type: "Shopkeeper",
    date: "2025-04-20",
    shopName: "Anita's Boutique",
    shopCert:
      "https://img.freepik.com/free-vector/free-delivery-logo-with-bike-man-courier_1308-48827.jpg?semt=ais_hybrid&w=740",
    status: "Blocked",
  },
};

const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const vendor = mockVendorData[id];

  if (!vendor) {
    return <div>No vendor found.</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <Button onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        Back
      </Button>
      <Card title={`Vendor: ${vendor.fullname}`} bordered>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Full Name">
            {vendor.fullname}
          </Descriptions.Item>
          <Descriptions.Item label="Age">{vendor.age}</Descriptions.Item>
          <Descriptions.Item label="Gender">{vendor.gender}</Descriptions.Item>
          <Descriptions.Item label="Email">{vendor.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{vendor.phone}</Descriptions.Item>
          <Descriptions.Item label="Type">{vendor.type}</Descriptions.Item>
          <Descriptions.Item label="Registration Date">
            {vendor.date}
          </Descriptions.Item>
          <Descriptions.Item label="Shop Name">
            {vendor.shopName}
          </Descriptions.Item>
          <Descriptions.Item label="Shop Certificate">
            <img
              src={vendor.shopCert}
              alt="Shop Cert"
              style={{ width: "100%", maxWidth: 300 }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(vendor.status)}>
              {vendor.status.toUpperCase()}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default VendorDetails;
