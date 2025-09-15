import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    // Old endpoint
    getOrder: builder.query({
      query: () => "admin/orders-list",
      providesTags: ["Order"],
    }),

    // New endpoint
    getAllOrders: builder.query({
      query: () => "admin/get-all-orders",
      providesTags: ["Order"],
    }),
  }),
});

export const { useGetOrderQuery, useGetAllOrdersQuery } = orderApi;
