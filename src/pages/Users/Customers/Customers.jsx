import React, { useState } from "react";
import {
  Avatar,
  Button,
  Col,
  Image,
  message,
  Popconfirm,
  Row,
  Space,
  Spin,
  Tag,
} from "antd";
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
  const handleCustomerStatus = async (userId) => {
    try {
      const response = await updateStatus({
        id: userId,
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
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Profile",
      dataIndex: "userImage",
      key: "userImage",
      render: (image, record) => (
        <Image
          src={image}
          alt={record.name}
          width={50}
          height={50}
          style={{ objectFit: "cover", borderRadius: "50%" }}
          fallback="https://ui-avatars.com/api/?name=User&background=random"
          preview={{ mask: "Click to preview" }}
        />
      ),
    },
    {
      title: "Full Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <div style={{ minWidth: "150px" }}>{text}</div>,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => (
        <div style={{ minWidth: "150px" }}>
          <span style={{ color: "#4FC3F7" }}>{text}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Bio",
      dataIndex: "bio",
      key: "bio",
      render: (text) => <div style={{ minWidth: "200px" }}>{text || "--"}</div>,
    },
    {
      title: "Followers",
      dataIndex: "followers",
      key: "followers",
    },
    {
      title: "Following",
      dataIndex: "following",
      key: "following",
    },
    {
      title: "Shares",
      dataIndex: "total_shares",
      key: "total_shares",
      render: (text) => <span>{text ?? 0}</span>,
    },
    {
      title: "Notifications",
      dataIndex: "isNotificationEnable",
      key: "isNotificationEnable",
      render: (value) =>
        value ? (
          <Tag color="green">Enabled</Tag>
        ) : (
          <Tag color="red">Disabled</Tag>
        ),
    },
    {
      title: "Active Status",
      dataIndex: "activeStatus",
      key: "activeStatus",
      render: (value) => (
        <div style={{ minWidth: "100px" }}>
          {value ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">Inactive</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Registration Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => (
        <div style={{ minWidth: "150px" }}>
          <span>{toIST(value)}</span>
        </div>
      ),
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value) => (
        <div style={{ minWidth: "150px" }}>
          <span>{toIST(value)}</span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        return (
          <Space>
            {/* <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleModalOpen(record)}
            >
              Edit
            </Button> */}

            <Button
              onClick={() => handleCustomerStatus(record._id)}
              style={{
                backgroundColor:
                  record?.activeStatus === true ? "#ff4d4f" : "#2dba4e",
                color: "#fff",
                borderColor:
                  record?.activeStatus === true ? "#ff4d4f" : "#2dba4e",
              }}
              icon={
                record?.activeStatus === true ? (
                  <StopOutlined />
                ) : (
                  <CheckCircleOutlined />
                )
              }
            >
              {record?.activeStatus === true ? "Inactive" : "Active"}
            </Button>

            {/* <Popconfirm
              title="Are you sure you want to delete this user?"
              description="This action cannot be undone."
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDeleteCustomer(record._id)}
            >
              <Button type="primary" danger icon={<DeleteOutlined />} />
            </Popconfirm> */}
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

          {/* <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleModalOpen()}
            >
              Add Customer
            </Button>
          </Col> */}
        </Row>
      </div>
      {!customersData && !customersData?.users ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "40vh",
            flexDirection: "column",
          }}
        >
          <Spin />
          <p>Loading.. Please wait</p>
        </div>
      ) : (
        <div>
          <CustomTable
            dataSource={customersData?.users}
            columns={columns}
            pagination={pagination}
            onChange={handleTableChange}
          />
        </div>
      )}

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
