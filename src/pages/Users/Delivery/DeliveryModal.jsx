import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const DeliveryModal = ({ visible, onCancel, onSubmit, editingDelivery }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingDelivery) {
      form.setFieldsValue(editingDelivery);
    } else {
      form.resetFields();
    }
  }, [editingDelivery, form]);

  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

  const handleFinish = (values) => {
    const formData = new FormData();
    const date = editingDelivery
      ? editingDelivery.registration_date?.split("T")[0]
      : new Date().toISOString().split("T")[0];

    formData.append("full_name", values.full_name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("age", values.age);
    formData.append("gender", values.gender);
    formData.append("type", values.type);
    formData.append("status", values.status);
    formData.append("user_type", "Delivery");
    formData.append("registration_date", date);
    formData.append("vehicle_type", values.vehicle_type);
    formData.append("vehicle_brand", values.vehicle_brand);
    formData.append("vehicle_model", values.vehicle_model);

    const fileFields = [
      "delivery_photo",
      "vehicle_front",
      "vehicle_back",
      "rc_front",
      "rc_back",
      "license_photo",
    ];

    fileFields.forEach((field) => {
      const file = values[field]?.[0]?.originFileObj;
      if (file) formData.append(field, file);
    });

    if (editingDelivery) formData.append("id", editingDelivery.id);

    onSubmit(formData);
    // form.resetFields();
  };

  return (
    <Modal
      title={editingDelivery ? "Edit Delivery" : "Add Delivery"}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => form.submit()}
      okText={editingDelivery ? "Update" : "Create"}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          name="full_name"
          label="Full Name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
          <Input placeholder="Enter phone" />
        </Form.Item>

        <Form.Item name="age" label="Age" rules={[{ required: true }]}>
          <InputNumber placeholder="Enter age" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
          <Select placeholder="Select gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="type"
          label="Delivery Type"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select type">
            <Option value="seller">Seller</Option>
            <Option value="buyer">Buyer</Option>
            <Option value="consumer">Consumer</Option>
            <Option value="regular">Regular</Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select placeholder="Select status">
            <Option value="pending">Pending</Option>
            <Option value="active">Active</Option>
            <Option value="blocked">Blocked</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="vehicle_type"
          label="vehicle Type"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter vehicle type" />
        </Form.Item>

        <Form.Item
          name="vehicle_brand"
          label="vehicle Brand"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter vehicle brand" />
        </Form.Item>

        <Form.Item
          name="vehicle_model"
          label="vehicle Model"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter vehicle model" />
        </Form.Item>

        {/* Upload fields */}
        {[
          "delivery_photo",
          "vehicle_front",
          "vehicle_back",
          "rc_front",
          "rc_back",
          "license_photo",
        ].map((field) => (
          <Form.Item
            key={field}
            name={field}
            label={field
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: true,
                message: `Please upload ${field.replace(/_/g, " ")}`,
              },
            ]}
          >
            <Upload beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        ))}

        {editingDelivery && (
          <Form.Item label="Registration Date">
            <Input
              value={editingDelivery.registration_date?.split("T")[0]}
              disabled
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default DeliveryModal;
