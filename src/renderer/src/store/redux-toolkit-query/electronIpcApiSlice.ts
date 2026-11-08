import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import getDirectoryContentsQueryFn from "./getDirectoryContentsQueryFn";

export const electronIpcApi = createApi({
  reducerPath: "electronIpcApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getDirectoryContents: builder.query({
      queryFn: getDirectoryContentsQueryFn
    })
  })
});

export const { useGetDirectoryContentsQuery } = electronIpcApi;
