import React, { useState } from "react";
import { Modal, Input, Select, Button, Row, Col } from "antd";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { useUpdateProductMutation } from "../../redux/api/productApi";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Option } = Select;
const baseUrl = import.meta.env.VITE_BASE_URL;

const EditProductModal = ({
  editModalVisible,
  editRecord,
  setEditModalVisible,
}) => {
  const [updateProduct] = useUpdateProductMutation();
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Modal
      open={editModalVisible}
      title="Edit Product"
      onCancel={() => setEditModalVisible(false)}
      footer={null}
      width={700}
    >
      {editRecord && (
        <Formik
          initialValues={{
            name: editRecord?.name || "",
            description: editRecord?.description || "",
            actualprice: editRecord?.actual_price || "",
            sellingprice: editRecord?.selling_price || "",
            quantity: editRecord?.quantity || "",
            category: editRecord?.category || "",
            status: editRecord?.status || "active",
            specifications: editRecord?.specifications?.length
              ? editRecord.specifications
              : [{ key: "", value: "" }],
            images: [],
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("Name is required"),
            description: Yup.string().required("Description is required"),
            actualprice: Yup.number().required("Actual price is required"),
            sellingprice: Yup.number().required("Selling price is required"),
            quantity: Yup.number().required("Quantity is required"),
            category: Yup.string().required("Category is required"),
            status: Yup.string().required("Status is required"),
          })}
          onSubmit={async (values) => {
            setIsSubmitting(true);
            try {
              const formData = new FormData();
              Object.entries(values).forEach(([key, val]) => {
                if (key === "specifications") {
                  formData.append("specifications", JSON.stringify(val));
                } else {
                  formData.append(key, val);
                }
              });
              values.images.forEach((file) => {
                formData.append("images", file);
              });

              const res = await updateProduct({
                id: editRecord.id,
                data: formData,
              });

              if (res?.data) {
                toast.success("Product updated successfully");
                setEditModalVisible(false);
              } else {
                toast.error("Update failed");
              }
            } catch (error) {
              console.error("Error updating product:", error);
              toast.error("Something went wrong");
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form>
              <div style={{ marginBottom: 16 }}>
                <label>Product Name</label>
                <Field name="name" as={Input} placeholder="Enter name" />
                {touched.name && errors.name && (
                  <div style={{ color: "red" }}>{errors.name}</div>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Description</label>
                <Field name="description" as={TextArea} rows={3} />
                {touched.description && errors.description && (
                  <div style={{ color: "red" }}>{errors.description}</div>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Actual Price</label>
                <Field name="actualprice" as={Input} />
                {touched.actualprice && errors.actualprice && (
                  <div style={{ color: "red" }}>{errors.actualprice}</div>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Selling Price</label>
                <Field name="sellingprice" as={Input} />
                {touched.sellingprice && errors.sellingprice && (
                  <div style={{ color: "red" }}>{errors.sellingprice}</div>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Quantity</label>
                <Field name="quantity" as={Input} />
                {touched.quantity && errors.quantity && (
                  <div style={{ color: "red" }}>{errors.quantity}</div>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Category</label>
                <Select
                  value={values.category}
                  onChange={(val) => setFieldValue("category", val)}
                  style={{ width: "100%" }}
                >
                  <Option value="electronics">Electronics</Option>
                  <Option value="fashion">Fashion</Option>
                  <Option value="grocery">Grocery</Option>
                </Select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Status</label>
                <Select
                  value={values.status}
                  onChange={(val) => setFieldValue("status", val)}
                  style={{ width: "100%" }}
                >
                  <Option value="active">Active</Option>
                  <Option value="block">Block</Option>
                  <Option value="pending">Pending</Option>
                </Select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Specifications</label>
                <FieldArray name="specifications">
                  {({ push, remove }) => (
                    <>
                      {values.specifications.map((spec, index) => (
                        <Row gutter={8} key={index} style={{ marginBottom: 8 }}>
                          <Col span={10}>
                            <Field
                              name={`specifications[${index}].key`}
                              as={Input}
                              placeholder="Key"
                            />
                          </Col>
                          <Col span={10}>
                            <Field
                              name={`specifications[${index}].value`}
                              as={Input}
                              placeholder="Value"
                            />
                          </Col>
                          <Col span={4}>
                            <Button danger onClick={() => remove(index)}>
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Button
                        type="dashed"
                        onClick={() => push({ key: "", value: "" })}
                      >
                        + Add Specification
                      </Button>
                    </>
                  )}
                </FieldArray>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Upload Images (Max: 5)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setFieldValue("images", Array.from(e.target.files))
                  }
                />
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Modal>
  );
};

export default EditProductModal;
