import React, { useState } from "react";
import { Button, Col, message, Popconfirm, Row, Space, Tag } from "antd";
import {
  EditOutlined,
  StopOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import CustomTable from "../../../components/CustomTable/CustomTable";
import {
  useAddCustomerMutation,
  useDeleteCustomerMutation,
  useEditCustomerMutation,
  useGetCustomersQuery,
  useUpdateCustomerStatusMutation,
} from "../../../redux/api/customerApi";

import CustomerModal from "./CustomerModal";
import { getStatusColor, toIST } from "../../../Utills/Utills";
import { usersData } from "../../../Utills/dummydata";

const Customers = () => {
  const { data: customersData, refetch } = useGetCustomersQuery();
  const [addCustomer] = useAddCustomerMutation();
  const [editCustomer] = useEditCustomerMutation();
  const [updateStatus] = useUpdateCustomerStatusMutation();
  const [deleteStatus] = useDeleteCustomerMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 2,
  });

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleModalOpen = (customer = null) => {
    setEditingCustomer(customer);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setEditingCustomer(null);
    setModalVisible(false);
  };

  const handleSubmit = async (formData) => {
    console.log(formData.id);
    try {
      const res = editingCustomer
        ? await editCustomer({ id: formData.id, formData })
        : await addCustomer(formData);

      if (res && res?.data) {
        toast.success(editingCustomer ? "Customer updated" : "Customer added");
        handleModalClose();
        refetch();
      } else {
        throw new Error(res?.error?.message || "Failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // Block/Active Handler
  const handleCustomerStatus = async (vendorId, newStatus) => {
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

  // Delete Handler
  const handleDeleteCustomer = async (vendorId) => {
    try {
      const response = await deleteStatus({ id: vendorId });
      console.log(response);
      if (response?.data) {
        toast.success("Status updated successfully");
      } else {
        toast.error(response?.message || "Failed to delete Customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("An error occurred while deleting the customer");
    }
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "full_name",
      id: "full_name",
      render: (text) => (
        <span style={{ color: "#0A84FF", cursor: "pointer" }}>{text}</span>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      id: "username",
      render: (text) => <span style={{ color: "#4FC3F7" }}>@{text}</span>,
    },
    { title: "Age", dataIndex: "age", id: "age" },
    { title: "Gender", dataIndex: "gender", id: "gender" },
    { title: "Email", dataIndex: "email", id: "email" },

    {
      title: "Posts",
      dataIndex: "total_posts",
      id: "total_posts",
    },
    {
      title: "Likes",
      dataIndex: "total_likes",
      id: "total_likes",
    },
    {
      title: "Shares",
      dataIndex: "total_shares",
      id: "total_shares",
    },

    {
      title: "Status",
      dataIndex: "status",
      id: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Registration Date",
      dataIndex: "registration_date",
      id: "registration_date",
      render: (value) => <span>{toIST(value)}</span>,
    },
    {
      title: "Actions",
      id: "actions",
      render: (_, record) => {
        const isBlocked = record.status?.toLowerCase() === "block";
        const isPending = record.status?.toLowerCase() === "pending";

        const nextStatus = isPending || isBlocked ? "active" : "block";
        const statusLabel =
          nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1);

        return (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleModalOpen(record)}
            >
              Edit
            </Button>

            <Button
              onClick={() => handleCustomerStatus(record.id, nextStatus)}
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
              title="Are you sure you want to delete this user?"
              description="This action cannot be undone."
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDeleteCustomer(record.id)}
            >
              <Button type="primary" danger icon={<DeleteOutlined />}></Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <h2
              style={{
                margin: 0,
                fontSize: "26px",
                fontWeight: "600",
                color: "#001F54",
                borderBottom: "3px solid #001F54",
                display: "inline-block",
                paddingBottom: "4px",
              }}
            >
              Users List
            </h2>
          </Col>

          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleModalOpen()}
            >
              Add Customer
            </Button>
          </Col>
        </Row>
      </div>
      <div>
        <CustomTable
          dataSource={usersData}
          columns={columns}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
      <CustomerModal
        visible={modalVisible}
        onCancel={handleModalClose}
        onSubmit={handleSubmit}
        editingCustomer={editingCustomer}
      />
    </div>
  );
};

export default Customers;
