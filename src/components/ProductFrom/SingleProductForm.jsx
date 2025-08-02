import React, { useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { Input, Button, Select, message, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAddSingleProductMutation } from "../../redux/api/productApi";
import { toast } from "react-toastify";
import { useGetCategoryListQuery } from "../../redux/api/categoryApi";

const { TextArea } = Input;
const { Option } = Select;

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  description: Yup.string().required("Description is required"),
  actualprice: Yup.number()
    .typeError("Price must be a number")
    .required("Actual Price is required"),
  sellingprice: Yup.number()
    .typeError("Price must be a number")
    .required("Selling Price is required"),
  quantity: Yup.number()
    .typeError("Price must be a number")
    .required("Quantity of product is required"),
  category: Yup.string().required("Category is required"),
  images: Yup.array()
    .min(1, "At least one image is required")
    .max(5, "You can only upload up to 5 images"),
});

const SingleProductForm = () => {
  const { data: categories = [], isLoading } = useGetCategoryListQuery();
  console.log(categories);
  const [addProduct] = useAddSingleProductMutation();
  const [previewImages, setPreviewImages] = useState([]);
  const [isActive, setIsActive] = useState(false);

  const handleImageChange = (e, setFieldValue, values) => {
    const files = Array.from(e.target.files);
    const totalSelected = files.length + values.images.length;

    if (totalSelected > 5) {
      message.error("You can only upload up to 5 images.");
      return;
    }

    const updatedFiles = [...values.images, ...files];
    const updatedPreviews = [
      ...previewImages,
      ...files.map((file) => URL.createObjectURL(file)),
    ];

    setFieldValue("images", updatedFiles);
    setPreviewImages(updatedPreviews);
  };

  const removeImage = (index, setFieldValue, values) => {
    const updatedFiles = [...values.images];
    const updatedPreviews = [...previewImages];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setFieldValue("images", updatedFiles);
    setPreviewImages(updatedPreviews);
  };

  const handleProductSubmit = async (values, { resetForm }) => {
    console.log("Submitted single product:", values);

    try {
      setIsActive(true);
      const specificationJSON = JSON.stringify(values.specifications);
      const formData = new FormData();

      // Append simple fields
      formData.append("specifications", specificationJSON);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("actual_price", values.actualprice);
      formData.append("selling_price", values.sellingprice);
      formData.append("quantity", values.quantity);
      formData.append("status", values.status);
      formData.append("category", values.category);

      // Append image(s) if any
      if (Array.isArray(values.images)) {
        values.images.forEach((imageFile, index) => {
          formData.append("images", imageFile); 
        });
      }

      const res = await addProduct(formData); 

      console.log(res);
      if (res?.data) {
        toast.success("Product created successfully!");
        resetForm();
        setPreviewImages([]);
        setIsActive(false);
      } else {
        throw new Error(res?.error?.message || "Failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setIsActive(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name: "",
        description: "",
        actualprice: "",
        sellingprice: "",
        quantity: "",
        status: "active",
        category: "",
        images: [],
        specifications: [{ key: "", value: "" }],
      }}
      validationSchema={validationSchema}
      onSubmit={handleProductSubmit}
    >
      {({ errors, touched, setFieldValue, values }) => (
        <Form>
          <div style={{ marginBottom: 16 }}>
            <label>Product Name</label>
            <Field name="name">
              {({ field }) => (
                <Input {...field} placeholder="Enter product name" />
              )}
            </Field>
            {touched.name && errors.name && (
              <div style={{ color: "red" }}>{errors.name}</div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Description</label>
            <Field name="description">
              {({ field }) => (
                <TextArea {...field} rows={4} placeholder="Enter description" />
              )}
            </Field>
            {touched.description && errors.description && (
              <div style={{ color: "red" }}>{errors.description}</div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Actual Price</label>
            <Field name="actualprice">
              {({ field }) => (
                <Input {...field} placeholder="Enter actual price" />
              )}
            </Field>
            {touched.actualprice && errors.actualprice && (
              <div style={{ color: "red" }}>{errors.actualprice}</div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Selling Price</label>
            <Field name="sellingprice">
              {({ field }) => (
                <Input {...field} placeholder="Enter selling price" />
              )}
            </Field>
            {touched.sellingprice && errors.sellingprice && (
              <div style={{ color: "red" }}>{errors.sellingprice}</div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Quantity</label>
            <Field name="quantity">
              {({ field }) => <Input {...field} placeholder="Enter quantity" />}
            </Field>
            {touched.quantity && errors.quantity && (
              <div style={{ color: "red" }}>{errors.quantity}</div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <FieldArray name="specifications">
              {({ push, remove, form }) => (
                <>
                  <label>Specifications</label>
                  {form.values.specifications.map((spec, index) => (
                    <Row gutter={8} key={index} style={{ marginBottom: 8 }}>
                      <Col span={10}>
                        <Field
                          name={`specifications[${index}].key`}
                          as={Input}
                          placeholder="Key (e.g., Material)"
                        />
                      </Col>
                      <Col span={10}>
                        <Field
                          name={`specifications[${index}].value`}
                          as={Input}
                          placeholder="Value (e.g., Cotton)"
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
            <label>Category</label>
            <Field name="category">
              {({ field }) => (
                <Select
                  {...field}
                  value={field.value || undefined}
                  onChange={(value) => setFieldValue("category", value)}
                  placeholder="Select category"
                  style={{ width: "100%" }}
                >
                  {categories.map((cat) => (
                    <Option key={cat.id} value={cat.name}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              )}
            </Field>
            {touched.category && errors.category && (
              <div style={{ color: "red" }}>{errors.category}</div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Upload Images (Min: 1, Max: 5)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageChange(e, setFieldValue, values)}
            />
            {touched.images && errors.images && (
              <div style={{ color: "red" }}>{errors.images}</div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: 12 }}>
              {previewImages.map((src, idx) => (
                <div key={idx} style={{ position: "relative", marginRight: 8 }}>
                  <img
                    src={src}
                    alt={`preview-${idx}`}
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                  />
                  <Button
                    type="text"
                    size="small"
                    danger
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      fontWeight: "bold",
                      background: "rgba(208, 206, 206, 0.8)",
                      border: "1px solid red",
                    }}
                    onClick={() => removeImage(idx, setFieldValue, values)}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            style={{ width: "100%" }}
            disabled={isActive} // ✅ Disable during submission
          >
            {isActive ? "Creating..." : "Create Product"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SingleProductForm;
