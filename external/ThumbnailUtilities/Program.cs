using System;
using System.IO;
using System.Threading.Tasks;
using Windows.Storage;
using Windows.Storage.FileProperties;

namespace ThumbnailUtilities
{
    public static class Program
    {
        private const int MAXIMUM_NUMBER_OF_ATTEMPTS = 5;
        private const string ERROR_MESSAGE =
            @"Usage: ThumbnailUtilities.exe <file path> <size>

<file path>  The absolute path to the file.
<size>       The size of the thumbnail to generate, measured in pixels.

e.g. ThumbnailUtilities.exe ""C:\Users\John Doe\Documents\report.docx"" 64";

        public static async Task<int> Main()
        {
            string[] args = Environment.GetCommandLineArgs();

            if (args.Length != 3)
            {
                Console.WriteLine(ERROR_MESSAGE);
                return 1;
            }

            string pathString = args[1];
            bool isAbsolutePath = Path.IsPathFullyQualified(pathString);

            if (!isAbsolutePath)
            {
                Console.WriteLine(ERROR_MESSAGE);
                return 1;
            }

            string sizeString = args[2];
            uint thumbnailSize;

            try
            {
                thumbnailSize = uint.Parse(sizeString);
            }
            catch (Exception ex)
                when (ex is ArgumentNullException or FormatException or OverflowException)
            {
                Console.WriteLine(ERROR_MESSAGE);
                return 1;
            }

            if (thumbnailSize == 0)
            {
                Console.WriteLine(ERROR_MESSAGE);
                return 1;
            }

            StorageFile file = await StorageFile.GetFileFromPathAsync(pathString);
            StorageItemThumbnail thumbnail = await GetThumbnailFromStorageItemAsync(
                file,
                thumbnailSize
            );
            Stream stream = thumbnail.AsStream();

            using MemoryStream memoryStream = new();
            stream.CopyTo(memoryStream);
            byte[] buffer = memoryStream.ToArray();

            string base64String = Convert.ToBase64String(buffer);
            string dataUrl = "data:image/png;base64," + base64String;

            Console.WriteLine(dataUrl);
            return 0;
        }

        private static async Task<StorageItemThumbnail> GetThumbnailFromStorageItemAsync(
            IStorageItemProperties storageItem,
            uint thumbnailSize
        )
        {
            for (int i = 0; i < MAXIMUM_NUMBER_OF_ATTEMPTS; i++)
            {
                StorageItemThumbnail thumbnail = await storageItem.GetThumbnailAsync(
                    ThumbnailMode.SingleItem,
                    thumbnailSize
                );
                if (thumbnail != null)
                {
                    return thumbnail;
                }
            }

            throw new Exception(
                $"Exceeded maximum number of attempts of {MAXIMUM_NUMBER_OF_ATTEMPTS}"
            );
        }
    }
}
