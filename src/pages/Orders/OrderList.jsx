import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Image,
  Tag,
  Popconfirm,
  message,
  Space,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useGetOrderQuery } from "../../redux/api/orderApi";
import { getStatusColor } from "../../Utills/Utills";

// Sample initial orders
const initialOrders = [
  {
    key: "1",
    orderId: "ORD123456",
    referenceIds: ["REF001", "REF002", "REF003", "REF004", "REF005", "REF006"],
    orderName: "Order One",
    description: "This is the first order description",
    amount: "$120.00",
    orderType: "Delivery",
    date: "2025-05-20",
    status: "Created",
    orderImage: "https://cdn-icons-png.flaticon.com/512/890/890462.png",
  },
  {
    key: "2",
    orderId: "ORD789012",
    referenceIds: ["REF101", "REF102", "REF103", "REF104", "REF105", "REF106"],
    orderName: "Order Two",
    description: "This is the second order description",
    amount: "$250.00",
    orderType: "Self-Pickup",
    date: "2025-05-22",
    status: "Processing",
    orderImage: "https://cdn-icons-png.flaticon.com/512/890/890462.png",
  },
];

const OrderList = () => {
  const { data: order, isLoading } = useGetOrderQuery();
  const [orders, setOrders] = useState(initialOrders);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const handleImageClick = (url) => {
    setModalImage(url);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    setOrders(orders.filter((order) => order.key !== key));
    message.success("Order deleted successfully.");
  };

  const handleEdit = (record) => {
    message.info(`Edit clicked for order ${record.orderId}`);
    // Implement actual edit functionality here (modal or redirect)
  };

  // Block/Active Handler
  const handleOrderStatus = async (vendorId, newStatus) => {
    console.log(newStatus);
    try {
      const response = await updateStatus({
        id: vendorId,
        status: newStatus,
      });
      console.log(response);
      if (response?.data) {
        toast.success("Status updated successfully");
      } else {
        toast.error(response?.message || "Failed to update status");
      }
    } catch (error) {
      console.log("Error Updating Status:", error);
      toast.error("An error occured while changing the status");
    }
  };

  const columns = [
    {
      title: "Product ID",
      dataIndex: "product_id",
      key: "Id",
      width: 120,
    },
    {
      title: "Order Number",
      dataIndex: "order_number",
      key: "order_number",
      width: 150,
    },
    {
      title: "Reference Id",
      dataIndex: "ref_ids",
      key: "ref_ids",
      width: 200,
      render: (ref_ids) =>
        ref_ids?.split(",").map((id) => (
          <Tag color="blue" key={id}>
            {id}
          </Tag>
        )),
    },

    {
      title: "Order Name",
      dataIndex: "order_name",
      key: "order_name",
      width: 150,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 250,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
    },
    {
      title: "Order Type",
      dataIndex: "order_type",
      key: "order_type",
      width: 130,
      filters: [
        { text: "Delivery", value: "Delivery" },
        { text: "Self-Pickup", value: "Self-Pickup" },
      ],
      onFilter: (value, record) => record.orderType === value,
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
      filters: [
        { text: "Created", value: "Created" },
        { text: "Processing", value: "Processing" },
        { text: "Delivery", value: "Delivery" },
        { text: "Refund", value: "Refund" },
      ],
      onFilter: (value, record) => record.status === value,
    },

    {
      title: "Actions",
      key: "actions",
      // fixed: "right",
      width: 140,
      render: (_, record) => {
        const isBlocked = record.status?.toLowerCase() === "block";
        const isProcessing = record.status?.toLowerCase() === "processing";

        const nextStatus = isProcessing || isBlocked ? "active" : "block";
        const statusLabel =
          nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1);
        return (
          <Space>
            <>
              <Button
                type="primary"
                icon={<EditOutlined />}
                style={{ marginRight: 8 }}
                onClick={() => handleEdit(record)}
              >
                Edit
              </Button>

              <Button
                onClick={() => handleOrderStatus(record.id, nextStatus)}
                style={{
                  backgroundColor:
                    nextStatus === "active" ? "#2dba4e" : "#ff4d4f",
                  color: "#fff",
                  borderColor: nextStatus === "active" ? "#2dba4e" : "#ff4d4f",
                }}
                icon={
                  nextStatus === "active" ? (
                    <CheckCircleOutlined />
                  ) : (
                    <StopOutlined />
                  )
                }
              >
                {statusLabel}
              </Button>

              <Popconfirm
                title="Are you sure you want to delete this order?"
                onConfirm={() => handleDelete(record.key)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Order List</h2>
      <Table
        columns={columns}
        dataSource={order}
        pagination={{ pageSize: 5 }}
        rowKey="key"
        scroll={{ x: 1300 }}
      />

      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        centered
      >
        <img src={modalImage} alt="Order" style={{ width: "100%" }} />
      </Modal>
    </div>
  );
};

export default OrderList;
