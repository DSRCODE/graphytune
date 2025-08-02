import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
  }),
  tagTypes: ["Category", "SubCategory"],
  endpoints: (builder) => ({
    // ---------- MAIN CATEGORY ----------
    getCategoryList: builder.query({
      query: () => "admin/main-categories",
      providesTags: ["Category"],
    }),

    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: "admin/category-create",
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `admin/category-update/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `admin/category-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    // ---------- SUB CATEGORY ----------
    getSubCategoryList: builder.query({
      query: (categoryId) => `admin/sub-categories/${categoryId}`,
      providesTags: ["SubCategory"],
    }),

    createSubCategory: builder.mutation({
      query: ({ newSubCategory }) => ({
        url: `admin/category-create`,
        method: "POST",
        body: newSubCategory,
      }),
      invalidatesTags: ["SubCategory"],
    }),

    updateSubCategory: builder.mutation({
      query: ({ updatedData, mainCategoryId }) => ({
        url: `admin/category-update/${mainCategoryId}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["SubCategory"],
    }),

    deleteSubCategory: builder.mutation({
      query: (subCategoryId) => ({
        url: `admin/category-delete/${subCategoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubCategory"],
    }),
  }),
});

export const {
  // Main Category
  useGetCategoryListQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,

  // Sub Category
  useGetSubCategoryListQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = categoryApi;
