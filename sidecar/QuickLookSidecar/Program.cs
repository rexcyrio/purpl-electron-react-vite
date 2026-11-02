using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;

namespace QuickLookSidecar
{
  internal static partial class Program
  {
    [GeneratedRegex(@"(open|close|update) +""(.*)""")]
    private static partial Regex CommandRegex();

    private static readonly Regex commandRegex = CommandRegex();

    public static void Main()
    {
      while (true)
      {
        string? inputCommand = Console.ReadLine();

        if (string.IsNullOrEmpty(inputCommand))
        {
          continue;
        }

        if (!commandRegex.IsMatch(inputCommand))
        {
          Console.WriteLine(
            "Error: unknown command"
              + @"Usage: open   ""C:\path\to\file.txt"""
              + @"       close  ""C:\path\to\file.txt"""
              + @"       update ""C:\path\to\file.txt"""
          );
          continue;
        }

        Match match = commandRegex.Match(inputCommand);

        var (commandName, fullPath) = (match.Groups[1].Value, match.Groups[2].Value);

        bool isAbsolutePath = Path.IsPathFullyQualified(fullPath);

        if (!isAbsolutePath)
        {
          Console.WriteLine(
            $"Error: expected '{fullPath}' to be a fully qualified (i.e., absolute) path"
          );
          continue;
        }

        bool isExists = File.Exists(fullPath) || Directory.Exists(fullPath);

        if (!isExists)
        {
          Console.WriteLine($"Error: expected '{fullPath}' to exist");
          continue;
        }

        QuickLookBridge.Run(inputCommand);
      }
    }
  }

  public static class QuickLookBridge
  {
    private static readonly string defaultPathToQuickLookExe = GetDefaultPathToQuickLookExe();
    private const string quickLookProcessName = "QuickLook";

    private static string GetDefaultPathToQuickLookExe()
    {
      string userProfile = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
      return Path.Combine(userProfile, "AppData\\Local\\Programs\\QuickLook\\QuickLook.exe");
    }

    public static void Run(string fullPath)
    {
      Process process = new();
      process.StartInfo.FileName = $"\"{defaultPathToQuickLookExe}\" \"{fullPath}\"";
      process.StartInfo.CreateNoWindow = true;
      process.Start();
    }

    public static bool IsQuickLookOpen()
    {
      int processId = GetQuickLookProcess().Id;
      List<nint> windowHandles = GetProcessVisibleWindowHandles(processId);
      return windowHandles.Count > 0;
    }

    private static Process GetQuickLookProcess()
    {
      Process[] processes = Process.GetProcessesByName(quickLookProcessName);

      if (processes.Length == 1)
      {
        return processes[0];
      }

      // sort in ascending order by process.StartTime
      List<Process> processList = [.. processes];
      processList.Sort((p1, p2) => p1.StartTime.CompareTo(p2.StartTime));

      // when we open a new terminal and call
      //
      //     "C:\path\to\QuickLook.exe" "C:\path\to\file.txt"
      //
      // there seems to be a ~80ms time period where both the "main" QuickLook process
      // and the terminal's QuickLook.exe exist
      // => assume that the earliest process is the "main" QuickLook process
      return processList[0];
    }

    // Delegate to be used with EnumWindows
    private delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);

    [DllImport("user32.dll", SetLastError = true)]
    private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);

    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
    private static extern int GetWindowTextLength(IntPtr hWnd);

    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
    private static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    /// <summary>
    /// Gets the title of a window ("caption") given its handle (hWnd).
    /// </summary>
    /// <param name="hWnd">The handle to the window.</param>
    /// <returns>The window's title, or an empty string if the window has no title or an error occurs.</returns>
    private static string GetWindowTitle(IntPtr hWnd)
    {
      if (hWnd == IntPtr.Zero)
      {
        return string.Empty;
      }

      int length = GetWindowTextLength(hWnd);
      if (length == 0)
      {
        return string.Empty;
      }

      // +1 for the null terminator from GetWindowText()
      StringBuilder sb = new(length + 1);

      int charsCopied = GetWindowText(hWnd, sb, sb.Capacity);

      if (charsCopied == 0 && Marshal.GetLastWin32Error() != 0)
      {
        return string.Empty;
      }

      return sb.ToString();
    }

    /// <summary>
    /// Gets all top-level window handles for a given process.
    /// </summary>
    /// <param name="processId">The ID of the process.</param>
    /// <returns>A list of window handles (IntPtr) belonging to the process.</returns>
    private static List<IntPtr> GetProcessVisibleWindowHandles(int processId)
    {
      List<IntPtr> windowHandles = [];

      EnumWindows(
        (hWnd, lParam) =>
        {
          _ = GetWindowThreadProcessId(hWnd, out uint currentProcessId);

          if (
            currentProcessId == processId
            && GetWindowTitle(hWnd).Length == 0
            && IsWindowVisible(hWnd)
          )
          {
            windowHandles.Add(hWnd);
          }

          // we must return `true` here to continue enumerating the next top-level window
          // https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-enumwindows
          return true;
        },
        IntPtr.Zero
      );

      return windowHandles;
    }
  }
}
