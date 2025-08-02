import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ticketListApi = createApi({
  reducerPath: "ticketListApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
  }),
  tagTypes: ["ticketList"],
  endpoints: (builder) => ({
    // Get
    getTicketList: builder.query({
      query: () => "support/get-support-list",
      providesTags: ["ticketList"],
    }),

    // Add Support
    replyToTicket: builder.mutation({
      query: ({ id, message }) => ({
        url: `admin/tickets/${id}/reply`,
        method: "POST",
        body: { message },
      }),
      invalidatesTags: ["ticketList"],
    }),

    // Update
    updateTicket: builder.mutation({
      query: ({ id }) => ({
        url: `support/update-support-status?id=${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["ticketList"],
    }),

    // Delete
    deleteTicket: builder.mutation({
      query: ({ id }) => ({
        url: `support/delete-support?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ticketList"],
    }),
  }),
});

export const { useGetTicketListQuery, useReplyToTicketMutation, useUpdateTicketMutation, useDeleteTicketMutation } =
  ticketListApi;
