import React, { useState } from "react";
import { Button, Space, Tag, Modal, Image, Popconfirm } from "antd";
import {
  EditOutlined,
  StopOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { getStatusColor } from "../../../Utills/Utills";
import { Link } from "react-router-dom";
import {
  useAddDeliveryMutation,
  useGetDeliveriesQuery,
  useDeleteDeliveryMutation,
  useEditDeliveryMutation,
  useUpdateDeliveryStatusMutation,
} from "../../../redux/api/deliveryApi";
import { toast } from "react-toastify";
import DeliveryModal from "./DeliveryModal";

const baseUrl = import.meta.env.VITE_BASE_URL;

const Delivery = () => {
  const { data: deliveryData, isLoading, refetch } = useGetDeliveriesQuery();
  const [addDelivery] = useAddDeliveryMutation();
  const [editDelivery] = useEditDeliveryMutation();
  const [deleteStatus] = useDeleteDeliveryMutation();
  const [updateStatus] = useUpdateDeliveryStatusMutation();

  const [previewImage, setPreviewImage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(null);

  const showImageModal = (img) => {
    setPreviewImage(img);
    setIsModalVisible(true);
  };

  const handleModalOpen = (delivery = null) => {
    setEditingDelivery(delivery);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setEditingDelivery(null);
    setModalVisible(false);
  };

  const handleCancel = () => setIsModalVisible(false);

  const handleSubmit = async (formData) => {
    try {
      const res = editingDelivery
        ? await editDelivery({ id: formData.get("id"), formData })
        : await addDelivery(formData);

      if (res && res?.data) {
        toast.success(editingDelivery ? "Delivery updated" : "Delivery added");
        handleModalClose();
        refetch();
      } else {
        throw new Error(res?.error?.message || "Failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // Delete Handler
  const handleDeleteDelivery = async (vendorId) => {
    try {
      const response = await deleteStatus({ id: vendorId });
      console.log(response);
      if (response?.data && response) {
        toast.success("Status updated successfully");
      } else {
        toast.error(response?.data?.message || "Failed to delete Delivery");
      }
    } catch (error) {
      console.error("Error deleting Delivery:", error);
      toast.error("An error occurred while deleting the Delivery");
    }
  };

  // Block/Active Handler
  const handleDeliveryStatus = async (vendorId, newStatus) => {
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

  const renderImage = (imgUrl) => (
    <Space>
      <Image
        minWidth={40}
        height={40}
        src={`${baseUrl}/uploads/${imgUrl}`}
        alt="preview"
        style={{ objectFit: "cover", borderRadius: 4 }}
      />
      <Button
        icon={<EyeOutlined />}
        onClick={() => showImageModal(imgUrl)}
        type="link"
      />
    </Space>
  );

  const columns = [
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
      minWidth: 200,
      render: (text, record) => (
        <Link to={`/delivery/${record.key}`}>{text}</Link>
      ),
    },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Delivery Photo",
      dataIndex: "delivery_photo",
      key: "delivery_photo",
      render: (value) => renderImage(value),
      minWidth: 140,
    },
    {
      title: "Vehicle Front",
      dataIndex: "vehicle_front",
      key: "vehicle_front",
      render: (value) => renderImage(value),
      minWidth: 140,
    },
    {
      title: "Vehicle Back",
      dataIndex: "vehicle_back",
      key: "vehicle_back",
      render: (value) => renderImage(value),
      minWidth: 140,
    },
    {
      title: "License Photo",
      dataIndex: "license_photo",
      key: "license_photo",
      render: (value) => renderImage(value),
      minWidth: 140,
    },
    {
      title: "Vehicle Type",
      dataIndex: "vehicle_type",
      key: "vehicle_type",
      minWidth: 140,
    },
    {
      title: "Vehicle Brand",
      dataIndex: "vehicle_brand",
      key: "vehicle_brand",
      minWidth: 140,
    },
    {
      title: "Vehicle Model",
      dataIndex: "vehicle_model",
      key: "vehicle_model",
      minWidth: 140,
    },
    {
      title: "RC Front",
      dataIndex: "rc_front",
      key: "rc_front",
      render: (value) => renderImage(value),
      minWidth: 140,
    },
    {
      title: "RC Back",
      dataIndex: "rc_back",
      key: "rc_back",
      render: (value) => renderImage(value),
      minWidth: 140,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
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
              onClick={() => handleDeliveryStatus(record.id, nextStatus)}
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
              title="Are you sure you want to delete this Delivery?"
              description="This action cannot be undone."
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDeleteDelivery(record.id)}
            >
              <Button type="primary" danger icon={<DeleteOutlined />}></Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>Delivery List</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleModalOpen()}
        >
          Add Delivery
        </Button>
      </div>
      <CustomTable
        dataSource={deliveryData}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />

      <DeliveryModal
        visible={modalVisible}
        onCancel={handleModalClose}
        onSubmit={handleSubmit}
        editingDelivery={editingDelivery}
      />

      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        title="Image Preview"
        centered
        width={600} // Optional: sets a nice modal width
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image
            src={`${baseUrl}/uploads/${previewImage}`}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Delivery;
