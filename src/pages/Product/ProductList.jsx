import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Image,
  Tag,
  Popconfirm,
  message,
  Space,
  Row,
  Col,
  Input,
  Tabs,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import CustomTable from "../../components/CustomTable/CustomTable";
import {
  useDeleteProductMutation,
  useGetProductQuery,
  useUpdateProductStatusMutation,
} from "../../redux/api/productApi";
import { getStatusColor } from "../../Utills/Utills";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import EditProductModal from "../../components/ProductFrom/EditProductModal";
import { postsData } from "../../Utills/dummydata";
import TabPane from "antd/es/tabs/TabPane";
const baseUrl = import.meta.env.VITE_BASE_URL;

const ProductList = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: product, isLoading, refetch } = useGetProductQuery();

  const handleSearch = () => {
    refetch();
  };

  const [deleteProduct] = useDeleteProductMutation();
  const [updateProductStatus] = useUpdateProductStatusMutation();
  const [isModalVideoVisible, setIsModalVideoVisible] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [editImages, setEditImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState([]);
  const handleImageClick = (images) => {
    setModalImage(images);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    console.log("Editing Record:", record);
    setEditRecord(record);
    setEditModalVisible(true);
  };

  const showVideoModal = (url) => {
    setSelectedVideoUrl(url);
    setIsModalVideoVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVideoVisible(false);
    setSelectedVideoUrl(null);
  };
  // Block/Active Handler
  const handleProductStatus = async (vendorId, newStatus) => {
    console.log(newStatus);
    try {
      const response = await updateProductStatus({
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
  const handleDeleteProduct = async (productId) => {
    console.log("Deleting product:", productId);
    try {
      await deleteProduct({ id: productId });
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting Product:", error);
      toast.error("An error occurred while deleting the Product");
    }
  };

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user) => (
        <div>
          <strong>{user.name}</strong>
          <br />
          <span style={{ color: "#4FC3F7" }}>@{user.username}</span>
          <br />
          <small>{user.email}</small>
        </div>
      ),
      width: 220,
    },
    {
      title: "Video",
      dataIndex: "mediaUrls",
      key: "video",
      render: (mediaUrls) =>
        mediaUrls && mediaUrls.length > 0 ? (
          <Button
            icon={<EyeOutlined />}
            onClick={() => showVideoModal(mediaUrls)}
          >
            View Video
          </Button>
        ) : (
          <span style={{ color: "#aaa" }}>No Video</span>
        ),
      width: 160,
    },

    {
      title: "Likes",
      dataIndex: "likes",
      key: "likes",
      render: (likes) => likes.length,
      width: 100,
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      render: (comments) => comments.length,
      width: 100,
    },
    {
      title: "Shares",
      dataIndex: "shareCount",
      key: "shareCount",
      width: 100,
    },
    {
      title: "Visibility",
      dataIndex: "visibility",
      key: "visibility",
      render: (value) => (
        <Tag color={value === "public" ? "green" : "volcano"}>
          {value.toUpperCase()}
        </Tag>
      ),
      width: 120,
    },
    {
      title: "Comments Enabled",
      dataIndex: "commentsEnabled",
      key: "commentsEnabled",
      render: (value) => (
        <div style={{width:"150px"}}>
          {value ? (
            <Tag color="blue">Enabled</Tag>
          ) : (
            <Tag color="red">Disabled</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Posted On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) =>
        new Date(value).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      width: 220,
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (_, record) => (
    //     <Space>
    //       <Button
    //         type="primary"
    //         icon={<EditOutlined />}
    //         onClick={() => handleEdit(record)}
    //       >
    //         Edit
    //       </Button>

    //       <Popconfirm
    //         title="Are you sure you want to delete this post?"
    //         onConfirm={() => handleDeletePost(record._id)}
    //         okText="Yes"
    //         cancelText="No"
    //       >
    //         <Button type="primary" danger icon={<DeleteOutlined />} />
    //       </Popconfirm>
    //     </Space>
    //   ),
    //   width: 240,
    // },
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
              Posts List
            </h2>
          </Col>

          <Col>
            <Input.Search
              placeholder="Search products..."
              allowClear
              enterButton={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
          </Col>
        </Row>
      </div>
      <CustomTable
        columns={columns}
        dataSource={product?.posts}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        centered
        width={800}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: "12px",
            width: "100%",
          }}
        >
          {(Array.isArray(modalImage) ? modalImage.slice(0, 5) : []).map(
            (img, index) => (
              <img
                key={index}
                src={`${baseUrl}/uploads/products/${img}`}
                alt={`Product ${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
            )
          )}
        </div>
      </Modal>

      <EditProductModal
        editModalVisible={editModalVisible}
        editRecord={editRecord}
        setEditModalVisible={setEditModalVisible}
      />

      <Modal
        title="Video Preview"
        open={isModalVideoVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
        destroyOnClose
        centered
      >
        <Tabs defaultActiveKey="0">
          {selectedVideoUrl?.map((url, index) => (
            <TabPane tab={`Video ${index + 1}`} key={index.toString()}>
              <video
                src={url}
                controls
                autoPlay
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                  borderRadius: "8px",
                  objectFit: "contain",
                }}
              />
            </TabPane>
          ))}
        </Tabs>
      </Modal>
    </div>
  );
};

export default ProductList;
