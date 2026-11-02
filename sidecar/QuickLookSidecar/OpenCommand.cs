namespace QuickLookSidecar
{
  public class OpenCommand : ICommand
  {
    public string Name => "open";

    public void Execute(string fullPath)
    {
      if (QuickLookBridge.IsQuickLookOpen())
      {
        throw new QuickLookSidecarException(
          "Attempted to open (run) QuickLook.exe but QuickLook.exe was already open and visible"
        );
      }

      QuickLookBridge.Run(fullPath);
    }
  }
}
