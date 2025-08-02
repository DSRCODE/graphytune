import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";
import { toIST } from "../../../Utills/Utills";

const { Option } = Select;

const CustomerModal = ({ visible, onCancel, onSubmit, editingCustomer }) => {
  const [form] = Form.useForm();

  // When editing, fill form values
  useEffect(() => {
    if (editingCustomer) {
      form.setFieldsValue(editingCustomer);
    } else {
      form.resetFields();
    }
  }, [editingCustomer, form]);

  const handleFinish = (values) => {
    const payload = {
      ...values,
      user_type: "customer",
      registration_date: editingCustomer
        ? editingCustomer.registration_date?.split("T")[0]
        : new Date().toISOString().split("T")[0],
    };

    if (editingCustomer) {
      payload.id = editingCustomer.id;
    }

    onSubmit(payload);
    form.resetFields();
  };

  return (
    <Modal
      title={editingCustomer ? "Edit Customer" : "Add Customer"}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => form.submit()}
      okText={editingCustomer ? "Update" : "Create"}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          name="full_name"
          label="Full Name"
          rules={[{ required: true, message: "Please enter full name" }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please enter email" }]}
        >
          <Input type="email" placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input placeholder="Enter phone" />
        </Form.Item>

        <Form.Item
          name="age"
          label="Age"
          rules={[{ required: true, message: "Please enter age" }]}
        >
          <InputNumber placeholder="Enter age" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select gender" }]}
        >
          <Select placeholder="Select gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="type"
          label="Customer Type"
          rules={[{ required: true, message: "Please select type" }]}
        >
          <Select placeholder="Select customer type">
            <Option value="seller">Seller</Option>
            <Option value="buyer">Buyer</Option>
            <Option value="consumer">Consumer</Option>
            <Option value="regular">Regular</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select placeholder="Select status">
            <Option value="pending">Pending</Option>
            <Option value="active">Active</Option>
            <Option value="blocked">Blocked</Option>
          </Select>
        </Form.Item>

        {editingCustomer && (
          <Form.Item label="Registration Date">
            <Input
              value={editingCustomer.registration_date?.split("T")[0]}
              disabled
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CustomerModal;
