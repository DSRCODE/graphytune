import React, { useEffect, useState } from "react";
import {
  Tabs,
  Table,
  Button,
  Modal,
  Input,
  Space,
  Typography,
  Popconfirm,
  Spin,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useGetCategoryListQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetSubCategoryListQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} from "../redux/api/categoryApi";
import { toast } from "react-toastify";

const Category = () => {
  // MAIN CATEGORY OPERATIONS
  const { data: categories = [], isLoading: isLoadingCategories } =
    useGetCategoryListQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // SUB CATEGORY STATE
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const {
    data: subCategories = [],
    isLoading: isLoadingSub,
    refetch: refetchSub,
  } = useGetSubCategoryListQuery(selectedCategoryId, {
    skip: !selectedCategoryId, // skip until a category is selected
  });
  const [createSubCategory] = useCreateSubCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  // MODAL STATE
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const [subModalOpen, setSubModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [categoryLabels, setCategoryLabels] = useState("");

  const [subloading, setSubLoading] = useState(false);

  // CATEGORY HANDLERS
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryName("");
    setModalOpen(true);
  };

  const handleEditCategory = (record) => {
    setEditingCategory(record);
    setCategoryName(record.name);
    setModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleSubmitCategory = async () => {
    if (!categoryName.trim()) return toast.warning("Category name is required");

    setLoading(true);
    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          updatedData: { name: categoryName },
        }).unwrap();
        toast.success("Category updated");
      } else {
        await createCategory({
          name: categoryName,
        }).unwrap();
        toast.success("Category created");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // SUB-CATEGORY HANDLERS
  const handleAddSubCategory = (categoryId) => {
    setEditingSubCategory(null);
    setSelectedCategoryId(categoryId);
    setSubCategoryName("");
     setCategoryLabels("");
    setSubModalOpen(true);
  };

  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const handleEditSubCategory = (record) => {
    setEditingSubCategory(record);
    setSubCategoryName(record.name);
    setCategoryLabels(record.labels?.join(", ") || "");
    setSubModalOpen(true);
  };

  const handleDeleteSubCategory = async (id) => {
    try {
      await deleteSubCategory(id).unwrap();
      toast.success("Sub-category deleted");
      refetchSub();
    } catch (err) {
      toast.error("Failed to delete sub-category");
    }
  };

  const handleSubmitSubCategory = async () => {
    if (!subCategoryName.trim())
      return toast.warning("Sub-category name is required");
    const labelsArray = categoryLabels
      .split(",")
      .map((label) => label.trim())
      .filter((label) => label);

    console.log(labelsArray);

    setSubLoading(true);
    try {
      if (editingSubCategory) {
        await updateSubCategory({
          mainCategoryId: editingSubCategory.id,
          // subCategoryId: editingSubCategory.id,
          updatedData: {
            name: subCategoryName,
            parent_id: editingSubCategory.parent_id,
            labels: labelsArray,
          },
        }).unwrap();
        toast.success("Sub-category updated");
      } else {
        await createSubCategory({
          newSubCategory: {
            name: subCategoryName,
            parent_id: selectedCategoryId,
            labels: labelsArray,
          },
        }).unwrap();
        toast.success("Sub-category created");
      }
      setSubModalOpen(false);
      refetchSub();
    } catch (err) {
      toast.error("Failed to save sub-category");
    } finally {
      setSubLoading(false);
    }
  };

  const subCategoryColumns = [
    {
      title: "Sub-category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Labels",
      dataIndex: "labels",
      key: "labels",
      render: (labels) =>
        labels && labels.length > 0 ? labels.join(", ") : "—",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditSubCategory(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete?"
            onConfirm={() => handleDeleteSubCategory(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography.Title level={3}>Category Management</Typography.Title>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={handleAddCategory}
        >
          Add Category
        </Button>
      </div>

      <Tabs
        type="card"
        onChange={(key) => {
          setSelectedCategoryId(key);
        }}
        animated={false}
        tabBarGutter={8}
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        {categories.map((category) => (
          <Tabs.TabPane
            tab={
              <span>
                {category.name}
                <Space style={{ marginLeft: 8 }}>
                  <EditOutlined onClick={() => handleEditCategory(category)} />
                  <Popconfirm
                    title="Are you sure to delete this category?"
                    onConfirm={() => handleDeleteCategory(category.id)}
                  >
                    <DeleteOutlined style={{ color: "red" }} />
                  </Popconfirm>
                </Space>
              </span>
            }
            key={category.id}
          >
            <div style={{ marginBottom: 16 }}>
              <Button
                icon={<PlusOutlined />}
                onClick={() => handleAddSubCategory(category.id)}
              >
                Add Sub-category
              </Button>
            </div>

            {isLoadingSub ? (
              <div
                style={{
                  height: "200px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spin tip="Loading sub-categories..." size="large" />
              </div>
            ) : (
              <Table
                dataSource={subCategories || []}
                columns={subCategoryColumns}
                rowKey="id"
                bordered
                size="small"
              />
            )}
          </Tabs.TabPane>
        ))}
      </Tabs>

      {/* Main Category Modal */}
      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmitCategory}
        okText={editingCategory ? "Update" : "Create"}
        confirmLoading={loading}
      >
        <Input
          placeholder="Enter category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </Modal>

      {/* Sub Category Modal */}
      <Modal
        title={editingSubCategory ? "Edit Sub-category" : "Add Sub-category"}
        open={subModalOpen}
        onCancel={() => setSubModalOpen(false)}
        onOk={handleSubmitSubCategory}
        okText={editingSubCategory ? "Update" : "Create"}
        confirmLoading={subloading}
      >
        <label htmlFor="">Sub category</label>
        <Input
          placeholder="Enter sub-category name"
          value={subCategoryName}
          onChange={(e) => setSubCategoryName(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <label htmlFor="">Labels</label>
        <Input
          placeholder="Enter labels, e.g. Size, Colors"
          value={categoryLabels}
          onChange={(e) => setCategoryLabels(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Category;
