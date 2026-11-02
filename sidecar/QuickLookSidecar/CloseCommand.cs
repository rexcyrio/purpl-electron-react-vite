namespace QuickLookSidecar
{
  public class CloseCommand : ICommand
  {
    public string Name => "close";

    public void Execute(string fullPath)
    {
      if (!QuickLookBridge.IsQuickLookOpen())
      {
        throw new QuickLookSidecarException(
          "Attempted to close QuickLook.exe preview window but QuickLook.exe preview window was not open"
        );
      }

      QuickLookBridge.Run(fullPath);
    }
  }
}
