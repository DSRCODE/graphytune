import React, { useState } from "react";
import {
  Table,
  Tag,
  Typography,
  Button,
  Modal,
  Input,
  message as AntMessage,
  Row,
  Col,
} from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import {
  useDeleteTicketMutation,
  useGetTicketListQuery,
  useReplyToTicketMutation,
  useUpdateTicketMutation,
} from "../../redux/api/ticketListApi";
import { toIST } from "../../Utills/Utills";
import CustomTable from "../../components/CustomTable/CustomTable";
import { toast } from "react-toastify";

const { Text } = Typography;
const { TextArea } = Input;

const TicketListTable = () => {
  const { data: ticketList = [], isLoading } = useGetTicketListQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyToTicket] = useReplyToTicketMutation();
  const [updateTicket] = useUpdateTicketMutation();
  const [deleteTicket] = useDeleteTicketMutation();

  const handleReplyClick = (ticket) => {
    setSelectedTicket(ticket);
    setReplyMessage("");
    setIsModalOpen(true);
  };

  const handleReplySubmit = async () => {
    try {
      await replyToTicket({
        id: selectedTicket.id,
        message: replyMessage,
      }).unwrap();
      toast.success("Reply sent successfully!");
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to send reply.");
    }
  };

  // Update
  const handleUpdateSupport = async (id) => {
    try {
      await updateTicket({
        id: id,
      }).unwrap();
      toast.success("Support update successfully!");
    } catch (err) {
      toast.error("Failed to update Support.");
    }
  };
  // Delete
  const handleDeleteSupport = async (id) => {
    try {
      await deleteTicket({
        id: id,
      }).unwrap();
      toast.success("Item Delete successfully!");
    } catch (err) {
      toast.error("Failed to delete the item.");
    }
  };

  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "_id",
      key: "_id",
      render: (text) => <Text strong>{text}</Text>,
      minWidth: 250,
    },
    {
      title: "Created By",
      dataIndex: "name",
      key: "name",
      minWidth: 140,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      minWidth: 120,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      minWidth: 300,
    },
    {
      title: "Status",
      dataIndex: "isResolved",
      key: "isResolved",
      render: (status) => {
        switch (status) {
          case "Open":
            return <Tag color="blue">Open</Tag>;
          case "In Progress":
            return <Tag color="orange">In Progress</Tag>;
          case "resolved":
            return <Tag color="green">Resolved</Tag>;
          default:
            return <Tag>{status}</Tag>;
        }
      },
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => <Text type="secondary">{toIST(date)}</Text>,
      minWidth: 140,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {/* <Button
            type="default"
            style={{
              backgroundColor: "#00B9E8",
              color: "#fff",
              border: "1px solid #00B9E8",
              padding: "0 10px",
            }}
            onClick={() => handleReplyClick(record)}
          >
            Reply
          </Button> */}
          <Button
            type="default"
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              border: "1px solid #28a745",
              padding: "0 10px",
            }}
            onClick={() => {
              handleUpdateSupport(record._id);
            }}
          >
            Status
          </Button>
          <Button
            type="default"
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "1px solid #dc3545",
              padding: "0 10px",
            }}
            onClick={() => handleDeleteSupport(record._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
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
              Ticket List
            </h2>
          </Col>
        </Row>
      </div>
      <CustomTable
        columns={columns}
        dataSource={ticketList?.supports}
        pagination={{ pageSize: 10 }}
        rowKey="_id"
      />

      <Modal
        title={`Reply to Ticket #${selectedTicket?.id}`}
        open={isModalOpen}
        onOk={handleReplySubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Send Reply"
      >
        <TextArea
          rows={4}
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          placeholder="Type your reply here..."
        />
      </Modal>
    </div>
  );
};

export default TicketListTable;
