import React from "react";
import { Card, Descriptions, Tag, Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getStatusColor } from "../../../Utills/Utills";

// Mock data (in real app, fetch from API or state/store)
const mockCustomerData = {
  1: {
    fullname: "John Doe",
    age: 28,
    gender: "Male",
    email: "john@example.com",
    phone: "9876543210",
    address: "123, Baker Street",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    status: "active",
  },
  2: {
    fullname: "Priya Sharma",
    age: 32,
    gender: "Female",
    email: "priya@example.com",
    phone: "9876543211",
    address: "45, MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    status: "pending",
  },
};

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const customer = mockCustomerData[id];

  if (!customer) {
    return <p>Customer not found.</p>;
  }

  return (
    <Card
      title={`Customer Details - ${customer.fullname}`}
      extra={<Button onClick={() => navigate(-1)}>Back</Button>}
      style={{ margin: 20 }}
    >
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Full Name">
          {customer.fullname}
        </Descriptions.Item>
        <Descriptions.Item label="Age">{customer.age}</Descriptions.Item>
        <Descriptions.Item label="Gender">{customer.gender}</Descriptions.Item>
        <Descriptions.Item label="Email">{customer.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{customer.phone}</Descriptions.Item>
        <Descriptions.Item label="Address">
          {customer.address}
        </Descriptions.Item>
        <Descriptions.Item label="City">{customer.city}</Descriptions.Item>
        <Descriptions.Item label="State">{customer.state}</Descriptions.Item>
        <Descriptions.Item label="Pincode">
          {customer.pincode}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(customer.status)}>
            {customer.status.toUpperCase()}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default CustomerDetails;
