export default async function getDirectoryContentsQueryFn(folderPath: string) {
  try {
    const { status, message, data } = await window.api.getFsWinDirectoryContents(folderPath);

    if (status !== 200) {
      return {
        error: {
          status: status,
          message: message
        }
      };
    }

    return { data };
  } catch (error) {
    return {
      error: {
        status: -1,
        message: "An unknown error occurred over IPC"
      }
    };
  }
}
