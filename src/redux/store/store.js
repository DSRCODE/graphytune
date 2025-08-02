import { configureStore } from "@reduxjs/toolkit";
import { vendorApi } from "../api/vendorApi";
import { customerApi } from "../api/customerApi";
import { deliveryApi } from "../api/deliveryApi";
import { ticketListApi } from "../api/ticketListApi";
import { productApi } from "../api/productApi";
import { orderApi } from "../api/orderApi";
import { cmsApi } from "../api/cmsApi";
import { categoryApi } from "../api/categoryApi";

export const store = configureStore({
  reducer: {
    [vendorApi.reducerPath]: vendorApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [deliveryApi.reducerPath]: deliveryApi.reducer,
    [ticketListApi.reducerPath]: ticketListApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [cmsApi.reducerPath]: cmsApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(vendorApi.middleware)
      .concat(customerApi.middleware)
      .concat(deliveryApi.middleware)
      .concat(ticketListApi.middleware)
      .concat(productApi.middleware)
      .concat(orderApi.middleware)
      .concat(cmsApi.middleware)
      .concat(categoryApi.middleware),
});
