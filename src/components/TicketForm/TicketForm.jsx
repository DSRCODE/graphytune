import React from "react";
import { Formik, Form, Field } from "formik";
import { Input, Button, Select, message } from "antd";
import * as Yup from "yup";
import { db, auth } from "../firebase"; // import your firebase config
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const { TextArea } = Input;
const { Option } = Select;

const schema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  message: Yup.string().required("Message is required"),
  assignedToRole: Yup.string().required("Assign to role is required"),
});

const TicketForm = () => {
  const onSubmit = async (values, { resetForm }) => {
    try {
      await addDoc(collection(db, "tickets"), {
        ...values,
        userId: auth.currentUser.uid,
        status: "open",
        createdAt: serverTimestamp(),
      });
      message.success("Ticket submitted successfully");
      resetForm();
    } catch (error) {
      console.error(error);
      message.error("Failed to submit ticket");
    }
  };

  return (
    <Formik
      initialValues={{ title: "", message: "", assignedToRole: "admin" }}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Field name="title">
            {({ field }) => <Input {...field} placeholder="Title" />}
          </Field>
          {touched.title && errors.title && <div>{errors.title}</div>}

          <Field name="message">
            {({ field }) => (
              <TextArea {...field} rows={4} placeholder="Describe your issue" />
            )}
          </Field>
          {touched.message && errors.message && <div>{errors.message}</div>}

          <Field name="assignedToRole">
            {({ field, form }) => (
              <Select
                {...field}
                onChange={(value) =>
                  form.setFieldValue("assignedToRole", value)
                }
                style={{ width: "100%", marginTop: 10 }}
              >
                <Option value="admin">Admin</Option>
                <Option value="vendor">Vendor</Option>
                <Option value="delivery">Delivery</Option>
              </Select>
            )}
          </Field>
          {touched.assignedToRole && errors.assignedToRole && (
            <div>{errors.assignedToRole}</div>
          )}

          <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
            Submit Ticket
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default TicketForm;
