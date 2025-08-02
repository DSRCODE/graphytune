import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const cmsApi = createApi({
  reducerPath: "cmsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  tagTypes: ["cms"],
  endpoints: (builder) => ({
    // ✅ Fetch CMS page content by slug & user_type
    getCms: builder.query({
      query: ({ slug, user_type }) => ({
        url: `cms/get-cms-page?slug=${user_type}`,
        method: "GET",
      }),
      providesTags: ["cms"],
    }),

    // update cms
    editCms: builder.mutation({
      query: (csmdata) => ({
        url: "cms/update-cms-page",
        method: "PATCH",
        body: csmdata,
      }),
      invalidatesTags: ["cms"],
    }),
  }),
});

export const { useEditCmsMutation, useGetCmsQuery } = cmsApi;
