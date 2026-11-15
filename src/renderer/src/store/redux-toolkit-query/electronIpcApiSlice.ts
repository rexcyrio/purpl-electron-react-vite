import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import createNewFolderQueryFn from "./createNewFolderQueryFn";
import getDirectoryContentsQueryFn from "./getDirectoryContentsQueryFn";
import openFileExplorerQueryFn from "./openFileExplorerQueryFn";
import quitAppQueryFn from "./quitAppQueryFn";

export const electronIpcApi = createApi({
  reducerPath: "electronIpcApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    quitApp: builder.query({
      queryFn: quitAppQueryFn
    }),
    openFileExplorer: builder.query({
      queryFn: openFileExplorerQueryFn
    }),
    createNewFolder: builder.query({
      queryFn: createNewFolderQueryFn
    }),
    getDirectoryContents: builder.query({
      queryFn: getDirectoryContentsQueryFn
    })
  })
});

export const {
  useGetDirectoryContentsQuery,
  useLazyOpenFileExplorerQuery,
  useLazyCreateNewFolderQuery
} = electronIpcApi;
