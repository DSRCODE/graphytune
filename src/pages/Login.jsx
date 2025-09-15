import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input, Button, Typography, Card, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/auth.css";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const { Title } = Typography;

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(4, "Too Short!").required("Required"),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        "https://graphytune.com/api/admin/admin-login",
        values
      );

      if (response.data?.token) {
        login(response.data.token);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-image-section">
          <img
            src="https://t3.ftcdn.net/jpg/01/82/04/38/360_F_182043866_cQZwPYqKo2xZvZ8sSwW7rdRbf72GcsH4.jpg"
            alt="login visual"
          />
        </div>

        <div className="auth-form-section">
          <Card className="auth-card" bordered={false}>
            <Title level={2} style={{ textAlign: "center", color: "#1E3A8A" }}>
              Graphytune Admin
            </Title>
            <p className="tagline">Unleash your control</p>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                isSubmitting,
              }) => (
                <Form>
                  <div className="form-item">
                    <Input
                      name="email"
                      placeholder="Email"
                      prefix={<MailOutlined />}
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.email && errors.email && (
                      <div className="error">{errors.email}</div>
                    )}
                  </div>

                  <div className="form-item">
                    <Input.Password
                      name="password"
                      placeholder="Password"
                      prefix={<LockOutlined />}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.password && errors.password && (
                      <div className="error">{errors.password}</div>
                    )}
                  </div>

                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={isSubmitting}
                  >
                    Login
                  </Button>

                  {/* <Button
                    type="link"
                    block
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot Password?
                  </Button> */}
                </Form>
              )}
            </Formik>
          </Card>
        </div>
      </div>
    </div>
  );
}
