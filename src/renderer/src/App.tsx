import ErrorSnackbar from "./ErrorSnackbar";
import FileExplorer from "./components/fileExplorer/FileExplorer";
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";

export default function App() {
  return (
    <>
      <div className="grid-container">
        <Topbar />
        <Sidebar />
        {/* <FileExplorer /> */}
      </div>

      <ErrorSnackbar />
    </>
  );
}
