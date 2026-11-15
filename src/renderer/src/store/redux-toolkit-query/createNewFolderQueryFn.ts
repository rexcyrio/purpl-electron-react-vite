export default async function createNewFolderQueryFn(folderPath: string) {
  try {
    const { status, message, data } = await window.api.createNewFolder(folderPath);

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
