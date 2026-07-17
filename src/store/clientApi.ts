import { createApi } from "@reduxjs/toolkit/query/react";

import type {
  AvailableSlot,
  Category,
  CreateOrderInput,
  NotificationsResponse,
  Order,
  OrdersQuery,
  Paginated,
  Review,
  ReviewInput,
} from "@/src/lib/api";
import { appBaseQuery } from "@/src/store/baseQuery";

function pickData<T>(res: unknown): T {
  if (res && typeof res === "object" && "data" in res) {
    return (res as { data: T }).data;
  }
  return res as T;
}

/**
 * Client-facing (customer) cache — kept separate from adminApi so the two
 * areas don't share tags or invalidation. Covers browsing the catalog,
 * placing/viewing/cancelling the client's own orders, and booking slots.
 */
export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: appBaseQuery,
  // Re-sync the moment the user returns to the tab or reconnects.
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: [
    "Catalog",
    "MyOrder",
    "AvailableSlot",
    "Notification",
    "Review",
  ],
  endpoints: (builder) => ({
    // Browse the live catalog (categories → sub-categories → price plans).
    getCatalog: builder.query<Category[], void>({
      query: () => ({ url: "/categories" }),
      transformResponse: (res: unknown) => pickData<Category[]>(res),
      providesTags: ["Catalog"],
    }),

    // Available slots for a date — response is { date, data: [...] }.
    getAvailableSlots: builder.query<
      AvailableSlot[],
      { date: string; showBooked?: boolean }
    >({
      query: ({ date, showBooked }) => {
        const params = new URLSearchParams({ date });
        if (showBooked === false) params.set("show_booked", "false");
        return { url: `/booking-slots/available?${params.toString()}` };
      },
      transformResponse: (res: unknown) => pickData<AvailableSlot[]>(res),
      providesTags: ["AvailableSlot"],
    }),

    // The client's own orders (server scopes GET /orders to the caller).
    getMyOrders: builder.query<Paginated<Order>, OrdersQuery | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.page) params.set("page", String(args.page));
        if (args?.per_page) params.set("per_page", String(args.per_page));
        if (args?.status) params.set("status", args.status);
        const qs = params.toString();
        return { url: `/orders${qs ? `?${qs}` : ""}` };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((o) => ({
                type: "MyOrder" as const,
                id: o.id,
              })),
              { type: "MyOrder" as const, id: "LIST" },
            ]
          : [{ type: "MyOrder" as const, id: "LIST" }],
    }),

    getMyOrder: builder.query<Order, number>({
      query: (id) => ({ url: `/orders/${id}` }),
      transformResponse: (res: unknown) => pickData<Order>(res),
      providesTags: (_r, _e, id) => [{ type: "MyOrder", id }],
    }),

    createOrder: builder.mutation<unknown, CreateOrderInput>({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      invalidatesTags: [
        { type: "MyOrder", id: "LIST" },
        "AvailableSlot",
      ],
    }),

    cancelOrder: builder.mutation<unknown, number>({
      query: (id) => ({ url: `/orders/${id}/cancel`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "MyOrder", id },
        { type: "MyOrder", id: "LIST" },
      ],
    }),

    // ─── Notifications ──────────────────────────────────────────────
    getNotifications: builder.query<NotificationsResponse, void>({
      query: () => ({ url: "/notifications" }),
      providesTags: ["Notification"],
    }),
    markAllNotificationsRead: builder.mutation<unknown, void>({
      query: () => ({ url: "/notifications/read-all", method: "POST" }),
      invalidatesTags: ["Notification"],
    }),
    markNotificationRead: builder.mutation<unknown, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: "PATCH" }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation<unknown, string>({
      query: (id) => ({ url: `/notifications/${id}`, method: "DELETE" }),
      invalidatesTags: ["Notification"],
    }),

    // ─── Reviews ────────────────────────────────────────────────────
    getMyReviews: builder.query<Review[], void>({
      query: () => ({ url: "/reviews/my" }),
      transformResponse: (res: unknown) => pickData<Review[]>(res),
      providesTags: ["Review"],
    }),
    createReview: builder.mutation<unknown, ReviewInput>({
      query: (body) => ({ url: "/reviews", method: "POST", body }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useGetCatalogQuery,
  useGetAvailableSlotsQuery,
  useGetMyOrdersQuery,
  useGetMyOrderQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
  useGetMyReviewsQuery,
  useCreateReviewMutation,
} = clientApi;
