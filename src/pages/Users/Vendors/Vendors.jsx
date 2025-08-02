import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Image,
  Tag,
  Form,
  Input,
  Select,
  message,
  Upload,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  StopOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { getStatusColor, toIST } from "../../../Utills/Utills";
import {
  useGetVendorsQuery,
  useCreateVendorMutation,
  useEditVendorMutation,
  useDeleteVendorMutation,
  useBlockVendorMutation,
} from "../../../redux/api/vendorApi";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const { Option } = Select;
const baseUrl = import.meta.env.VITE_BASE_URL;

const Vendors = () => {
  const { data: vendors = [], isLoading } = useGetVendorsQuery();
  const [createVendor] = useCreateVendorMutation();
  const [editVendor] = useEditVendorMutation();
  const [deleteVendor] = useDeleteVendorMutation();
  const [blockVendor] = useBlockVendorMutation();

  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  console.log(editingVendor);

  const [form] = Form.useForm();

  const handleImageClick = (url) => {
    setImageUrl(url);
    setIsImageModalVisible(true);
  };

  const openAddModal = () => {
    setEditingVendor(null);
    form.resetFields();
    setIsFormModalVisible(true);
  };

  const openEditModal = (vendor) => {
    setEditingVendor(vendor);
    form.setFieldsValue({
      ...vendor,
      date: dayjs(vendor.date),
    });
    setIsFormModalVisible(true);
  };

  // Edit/Create Handler
  const handleSubmit = async () => {
    try {
      setIsActive(true);
      const values = await form.validateFields();
      const file = values.shop_certificate?.[0]?.originFileObj;

      const isEdit = Boolean(editingVendor);
      const formData = new FormData();

      if (file) {
        formData.append("shop_certificate", file);
      }

      formData.append("shop_name", values.shop_name);
      formData.append("full_name", values.full_name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("age", values.age);
      formData.append("gender", values.gender);
      formData.append("type", values.type);
      formData.append("status", values.status);

      if (!isEdit) {
        formData.append("user_type", "vendor");
        formData.append(
          "registration_date",
          new Date().toISOString().split("T")[0]
        );
      }

      const apiFunction = isEdit ? editVendor : createVendor;
      const payload = isEdit ? { id: editingVendor.id, formData } : formData;

      const response = await apiFunction(payload);

      if (response?.data) {
        toast.success(
          isEdit
            ? "Vendor Updated: The vendor has been successfully updated."
            : "Vendor Created: A new vendor has been successfully created."
        );
        setIsFormModalVisible(false);
        setIsActive(false);
      } else {
        throw new Error(response?.data?.message || "Unknown error");
      }
    } catch (error) {
      setIsActive(false);
      console.error("Error submitting vendor form:", error);
      toast.error(
        editingVendor
          ? `Update Failed: ${
              error?.message || "Something went wrong during update."
            }`
          : `Creation Failed: ${
              error?.message || "Something went wrong during creation."
            }`
      );
    }
  };

  // Delete Handler
  const handleDeleteVendor = async (vendorId) => {
    try {
      const response = await deleteVendor({ id: vendorId });
      console.log(response);

      if (response) {
        toast.success("Vendor deleted successfully");
      } else {
        toast.error(response || "Failed to delete vendor");
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast.error("An error occurred while deleting the vendor");
    }
  };

  // Block/Active Handler
  const handleStatusVendor = async (vendorId) => {
    try {
      const response = await blockVendor({ id: vendorId });
      console.log(response);
      if (response) {
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
      title: "Full Name",
      dataIndex: "full_name",
      render: (text, record) => (
        <span style={{ color: "blue", cursor: "pointer" }}>{text}</span>
      ),
      minWidth: 180,
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      minWidth: 140,
    },
    {
      title: "Type",
      dataIndex: "type",
      minWidth: 120,
    },

    {
      title: "Shop Name",
      dataIndex: "shop_name",
      render: (text) => <span>{text || "--"}</span>,
      minWidth: 160,
    },
    {
      title: "Shop Certificates",
      dataIndex: "shop_certificate",
      render: (url) =>
        url ? (
          <Image
            src={`${baseUrl}/uploads/${url}`}
            width={80}
            preview={false}
            onClick={() => handleImageClick(url)}
            style={{ cursor: "pointer", borderRadius: 4 }}
          />
        ) : (
          "--"
        ),
      minWidth: 180,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "registration_date",
      render: (text) => <span>{toIST(text)}</span>,
    },
    {
      title: "Actions",
      minWidth: 200,
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>
          <Button
            type="default"
            danger
            icon={<StopOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleStatusVendor(record.id)}
          />
          <Popconfirm
            title="Are you sure to delete this vendor?"
            onConfirm={() => handleDeleteVendor(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const dataSource = vendors.length > 0 ? vendors : [];

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>Vendors List</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Add Vendor
        </Button>
      </div>

      <CustomTable
        columns={columns}
        dataSource={dataSource}
        loading={isLoading || loading}
      />

      {/* Image Preview Modal */}
      <Modal
        visible={isImageModalVisible}
        footer={null}
        onCancel={() => setIsImageModalVisible(false)}
        centered
      >
        <img src={imageUrl} alt="Preview" style={{ width: "100%" }} />
      </Modal>

      {/* Add/Edit Vendor Modal */}
      <Modal
        title={editingVendor ? "Edit Vendor" : "Add Vendor"}
        open={isFormModalVisible}
        onCancel={() => setIsFormModalVisible(false)}
        onOk={handleSubmit}
        okText={editingVendor ? "Update" : "Create"}
        confirmLoading={isActive}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Full name" />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <Input type="number" placeholder="eg. 25" />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Vendor Type"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item> */}
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Option value="PENDING">Pending</Option>
              <Option value="ACTIVE">Active</Option>
              <Option value="BLOCK">Block</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="shop_name"
            label="Shop Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="shop_certificate"
            label="Shop Certificate"
            valuePropName="file"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e?.fileList;
            }}
            rules={[
              { required: true, message: "Please upload the shop certificate" },
            ]}
          >
            <Upload listType="picture" beforeUpload={() => false} maxCount={1}>
              <Button>Select File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Vendors;
