import React, { useState } from "react";
import { Descriptions, Tag, Image, Button, Modal, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { getStatusColor } from "../../../Utills/Utills";

const DeliveryDetail = ({ data }) => {
  const [previewImage, setPreviewImage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showImageModal = (img) => {
    setPreviewImage(img);
    setIsModalVisible(true);
  };

  const handleCancel = () => setIsModalVisible(false);

  const renderImage = (label, src) => (
    <Space>
      {/* <strong>{label}:</strong> */}
      <Image
        src={src}
        width={60}
        height={60}
        style={{ objectFit: "cover", borderRadius: 4 }}
      />
      <Button
        icon={<EyeOutlined />}
        onClick={() => showImageModal(src)}
        type="link"
      />
    </Space>
  );

  if (!data) return <p>No Delivery Data Provided</p>;

  return (
    <div>
      <h2>Delivery Detail - {data.fullname}</h2>

      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Full Name">{data.fullname}</Descriptions.Item>
        <Descriptions.Item label="Age">{data.age}</Descriptions.Item>
        <Descriptions.Item label="Gender">{data.gender}</Descriptions.Item>
        <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{data.phone}</Descriptions.Item>
        <Descriptions.Item label="Vehicle Type">
          {data.vehicleType}
        </Descriptions.Item>
        <Descriptions.Item label="Vehicle Brand">
          {data.vehicleBrand}
        </Descriptions.Item>
        <Descriptions.Item label="Vehicle Model">
          {data.vehicleModel}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(data.status)}>
            {data.status.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Delivery Photo">
          {renderImage("Delivery", data.deliveryPhoto)}
        </Descriptions.Item>
        <Descriptions.Item label="Vehicle Photo (Front)">
          {renderImage("Front", data.vehiclePhotoFront)}
        </Descriptions.Item>
        <Descriptions.Item label="Vehicle Photo (Back)">
          {renderImage("Back", data.vehiclePhotoBack)}
        </Descriptions.Item>
        <Descriptions.Item label="License Photo">
          {renderImage("License", data.licensePhoto)}
        </Descriptions.Item>
        <Descriptions.Item label="Vehicle RC (Front)">
          {renderImage("RC Front", data.vehicleRCFront)}
        </Descriptions.Item>
        <Descriptions.Item label="Vehicle RC (Back)">
          {renderImage("RC Back", data.vehicleRCBack)}
        </Descriptions.Item>
      </Descriptions>

      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        title="Image Preview"
      >
        <Image width="100%" src={previewImage} />
      </Modal>
    </div>
  );
};

export default DeliveryDetail;
