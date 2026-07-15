import { createApi } from "@reduxjs/toolkit/query/react";

import type {
  BookingSlot,
  BookingSlotInput,
  BookingSlotsQuery,
  Category,
  CategoryInput,
  DashboardStats,
  Order,
  OrdersQuery,
  Paginated,
  PriceCategory,
  PriceCategoryInput,
  SubCategory,
  SubCategoryInput,
  Worker,
  WorkerInput,
  WorkersQuery,
} from "@/src/lib/api";
import { appBaseQuery } from "@/src/store/baseQuery";

// Any catalog mutation can shift the nested category tree, sub-category list,
// and pricing list — refresh all three so every tab and dropdown stays in sync.
const CATALOG_TAGS = ["Category", "SubCategory", "PriceCategory"] as const;

/** Some detail/list endpoints wrap the payload in `{ data }`, some don't. */
function pickData<T>(res: unknown): T {
  if (res && typeof res === "object" && "data" in res) {
    return (res as { data: T }).data;
  }
  return res as T;
}

/**
 * Global cache for admin server data. Endpoints are added per phase
 * (dashboard + orders now; workers, catalog, roles to follow).
 */
export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: appBaseQuery,
  tagTypes: [
    "DashboardStats",
    "Order",
    "Worker",
    "Category",
    "SubCategory",
    "PriceCategory",
    "Slot",
    "Role",
  ],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => ({ url: "/dashboard/stats" }),
      providesTags: ["DashboardStats"],
    }),

    // GET /orders — Laravel paginator, NOT a flat array. Keep the envelope.
    getOrders: builder.query<Paginated<Order>, OrdersQuery>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args.page) params.set("page", String(args.page));
        if (args.per_page) params.set("per_page", String(args.per_page));
        if (args.status) params.set("status", args.status);
        if (args.client) params.set("client", args.client);
        if (args.from) params.set("from", args.from);
        if (args.to) params.set("to", args.to);
        if (args.category_id) params.set("category_id", String(args.category_id));
        const qs = params.toString();
        return { url: `/orders${qs ? `?${qs}` : ""}` };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((o) => ({ type: "Order" as const, id: o.id })),
              { type: "Order" as const, id: "LIST" },
            ]
          : [{ type: "Order" as const, id: "LIST" }],
    }),

    getOrder: builder.query<Order, number>({
      query: (id) => ({ url: `/orders/${id}` }),
      transformResponse: (res: unknown) => pickData<Order>(res),
      providesTags: (_r, _e, id) => [{ type: "Order", id }],
    }),

    // Available workers for the "assign worker" picker, scoped to a category.
    getAvailableWorkers: builder.query<Worker[], number>({
      query: (categoryId) => ({
        url: `/workers/available?category_id=${categoryId}`,
      }),
      transformResponse: (res: unknown) => pickData<Worker[]>(res),
      providesTags: ["Worker"],
    }),

    assignWorker: builder.mutation<unknown, { id: number; worker_id: number }>({
      query: ({ id, worker_id }) => ({
        url: `/orders/${id}/assign-worker`,
        method: "POST",
        body: { worker_id },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
        "Worker",
        "DashboardStats",
      ],
    }),

    updateOrderStatus: builder.mutation<
      unknown,
      { id: number; status: string; admin_notes?: string }
    >({
      query: ({ id, status, admin_notes }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body: admin_notes ? { status, admin_notes } : { status },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
        "Worker",
        "DashboardStats",
      ],
    }),

    // GET /workers — flat { data: [...] }, newest first.
    getWorkers: builder.query<Worker[], WorkersQuery | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.status) params.set("status", args.status);
        if (args?.category_id) params.set("category_id", String(args.category_id));
        const qs = params.toString();
        return { url: `/workers${qs ? `?${qs}` : ""}` };
      },
      transformResponse: (res: unknown) => pickData<Worker[]>(res),
      providesTags: (result) =>
        result
          ? [
              ...result.map((w) => ({ type: "Worker" as const, id: w.id })),
              { type: "Worker" as const, id: "LIST" },
            ]
          : [{ type: "Worker" as const, id: "LIST" }],
    }),

    createWorker: builder.mutation<unknown, WorkerInput>({
      query: (body) => ({ url: "/workers", method: "POST", body }),
      invalidatesTags: [{ type: "Worker", id: "LIST" }, "DashboardStats"],
    }),

    updateWorker: builder.mutation<
      unknown,
      { id: number } & Partial<WorkerInput>
    >({
      query: ({ id, ...body }) => ({
        url: `/workers/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Worker", id },
        { type: "Worker", id: "LIST" },
        "DashboardStats",
      ],
    }),

    deleteWorker: builder.mutation<unknown, number>({
      query: (id) => ({ url: `/workers/${id}`, method: "DELETE" }),
      // Deleting a worker nulls worker_id on their orders.
      invalidatesTags: [
        { type: "Worker", id: "LIST" },
        { type: "Order", id: "LIST" },
        "DashboardStats",
      ],
    }),

    // GET /categories — bare array with nested sub_categories + pricings.
    getCategories: builder.query<Category[], void>({
      query: () => ({ url: "/categories" }),
      transformResponse: (res: unknown) => pickData<Category[]>(res),
      providesTags: ["Category"],
    }),

    createCategory: builder.mutation<unknown, CategoryInput>({
      query: (body) => ({ url: "/categories", method: "POST", body }),
      invalidatesTags: [...CATALOG_TAGS],
    }),
    updateCategory: builder.mutation<
      unknown,
      { id: number } & Partial<CategoryInput>
    >({
      query: ({ id, ...body }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [...CATALOG_TAGS],
    }),
    deleteCategory: builder.mutation<unknown, number>({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: [...CATALOG_TAGS],
    }),

    // GET /sub-categories — flat { data: [...] }, each with category_pricings.
    getSubCategories: builder.query<SubCategory[], void>({
      query: () => ({ url: "/sub-categories" }),
      transformResponse: (res: unknown) => pickData<SubCategory[]>(res),
      providesTags: ["SubCategory"],
    }),
    createSubCategory: builder.mutation<unknown, SubCategoryInput>({
      query: (body) => ({ url: "/sub-categories", method: "POST", body }),
      invalidatesTags: [...CATALOG_TAGS],
    }),
    updateSubCategory: builder.mutation<
      unknown,
      { id: number } & Partial<SubCategoryInput>
    >({
      query: ({ id, ...body }) => ({
        url: `/sub-categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [...CATALOG_TAGS],
    }),
    deleteSubCategory: builder.mutation<unknown, number>({
      query: (id) => ({ url: `/sub-categories/${id}`, method: "DELETE" }),
      invalidatesTags: [...CATALOG_TAGS],
    }),

    // GET /price-categories — flat { data: [...] }, parent sub_category nested.
    getPriceCategories: builder.query<PriceCategory[], void>({
      query: () => ({ url: "/price-categories" }),
      transformResponse: (res: unknown) => pickData<PriceCategory[]>(res),
      providesTags: ["PriceCategory"],
    }),
    createPriceCategory: builder.mutation<unknown, PriceCategoryInput>({
      query: (body) => ({ url: "/price-categories", method: "POST", body }),
      invalidatesTags: [...CATALOG_TAGS],
    }),
    updatePriceCategory: builder.mutation<
      unknown,
      { id: number } & Partial<PriceCategoryInput>
    >({
      query: ({ id, ...body }) => ({
        url: `/price-categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [...CATALOG_TAGS],
    }),
    deletePriceCategory: builder.mutation<unknown, number>({
      query: (id) => ({ url: `/price-categories/${id}`, method: "DELETE" }),
      invalidatesTags: [...CATALOG_TAGS],
    }),

    // GET /booking-slots — admin list, flat { data: [...] }, date then time_from.
    getBookingSlots: builder.query<BookingSlot[], BookingSlotsQuery | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.date) params.set("date", args.date);
        if (args?.is_active !== undefined) {
          params.set("is_active", args.is_active ? "1" : "0");
        }
        const qs = params.toString();
        return { url: `/booking-slots${qs ? `?${qs}` : ""}` };
      },
      transformResponse: (res: unknown) => pickData<BookingSlot[]>(res),
      providesTags: (result) =>
        result
          ? [
              ...result.map((s) => ({ type: "Slot" as const, id: s.id })),
              { type: "Slot" as const, id: "LIST" },
            ]
          : [{ type: "Slot" as const, id: "LIST" }],
    }),

    createBookingSlot: builder.mutation<unknown, BookingSlotInput>({
      query: (body) => ({ url: "/booking-slots", method: "POST", body }),
      invalidatesTags: [{ type: "Slot", id: "LIST" }],
    }),

    updateBookingSlot: builder.mutation<
      unknown,
      { id: number } & Partial<BookingSlotInput>
    >({
      query: ({ id, ...body }) => ({
        url: `/booking-slots/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Slot", id },
        { type: "Slot", id: "LIST" },
      ],
    }),

    deleteBookingSlot: builder.mutation<unknown, number>({
      query: (id) => ({ url: `/booking-slots/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Slot", id: "LIST" }],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetOrdersQuery,
  useGetOrderQuery,
  useGetAvailableWorkersQuery,
  useAssignWorkerMutation,
  useUpdateOrderStatusMutation,
  useGetWorkersQuery,
  useCreateWorkerMutation,
  useUpdateWorkerMutation,
  useDeleteWorkerMutation,
  useGetCategoriesQuery,
  useGetBookingSlotsQuery,
  useCreateBookingSlotMutation,
  useUpdateBookingSlotMutation,
  useDeleteBookingSlotMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetPriceCategoriesQuery,
  useCreatePriceCategoryMutation,
  useUpdatePriceCategoryMutation,
  useDeletePriceCategoryMutation,
} = adminApi;
