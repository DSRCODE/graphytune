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
import {
  useGetAllOrdersQuery,
  useGetOrderQuery,
} from "../../redux/api/orderApi";
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

const Transaction = () => {
  const { data: order, isLoading } = useGetAllOrdersQuery();
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
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      width: 220,
    },

    {
      title: "Buyer",
      dataIndex: ["buyerUserId", "name"],
      key: "buyer",
      render: (_, record) => (
        <Space>
          <Image
            src={record?.buyerUserId?.userImage}
            width={32}
            height={32}
            style={{ borderRadius: "50%" }}
          />
          <span>{record?.buyerUserId?.name}</span>
        </Space>
      ),
      width: 200,
    },
    {
      title: "Seller",
      dataIndex: ["sellerUserId", "name"],
      key: "seller",
      render: (_, record) => (
        <Space>
          <Image
            src={record?.sellerUserId?.userImage}
            width={32}
            height={32}
            style={{ borderRadius: "50%" }}
          />
          <span>{record?.sellerUserId?.name}</span>
        </Space>
      ),
      minWidth: 200,
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (products) =>
        products?.map((p) => (
          <div key={p._id} style={{ marginBottom: 8 }}>
            <Image
              src={p.imageUrl}
              width={40}
              height={40}
              style={{ marginRight: 8 }}
            />
            <strong>{p.title}</strong> ({p.quantity} × ₹{p.price})
          </div>
        )),
      minWidth: 250,
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      minWidth: 130,
      render: (amt) => `₹${amt}`,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      minWidth: 150,
      render: (status) => (
        <Tag color={status === "captured" ? "green" : "volcano"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Razorpay Order ID",
      dataIndex: "razorpayOrderId",
      key: "razorpayOrderId",
      minWidth: 220,
    },
    {
      title: "Razorpay Payment ID",
      dataIndex: "razorpayPaymentId",
      key: "razorpayPaymentId",
      minWidth: 220,
    },
    {
      title: "Address",
      dataIndex: "addressDetails",
      key: "address",
      render: (addr) =>
        addr ? (
          <div>
            <strong>{addr.label}</strong> <br />
            {addr.street}, {addr.city}, {addr.state}, {addr.postalCode},{" "}
            {addr.country}
          </div>
        ) : (
          "-"
        ),
      minWidth: 280,
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
        { text: "Created", value: "created" },
        { text: "Processing", value: "processing" },
        { text: "Delivered", value: "delivered" },
        { text: "Refund", value: "refund" },
      ],
      onFilter: (value, record) => record.status?.toLowerCase() === value,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
      minWidth: 180,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => new Date(date).toLocaleString(),
      minWidth: 180,
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   width: 180,
    //   render: (_, record) => (
    //     <Space>
    //       <Button
    //         type="primary"
    //         icon={<EditOutlined />}
    //         onClick={() => handleEdit(record)}
    //       >
    //         Edit
    //       </Button>
    //       <Popconfirm
    //         title="Are you sure you want to delete this order?"
    //         onConfirm={() => handleDelete(record._id)}
    //         okText="Yes"
    //         cancelText="No"
    //       >
    //         <Button type="primary" danger icon={<DeleteOutlined />} />
    //       </Popconfirm>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Transaction List</h2>
      <Table
        columns={columns}
        dataSource={order?.orders}
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

export default Transaction;
