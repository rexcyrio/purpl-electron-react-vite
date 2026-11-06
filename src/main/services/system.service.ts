import { app } from "electron";

export default class SystemService {
  quitApp() {
    app.quit();
  }

  getStartingDirectory() {
    // TODO: check settings.json first
    return "C:\\Users\\Stefan Lee\\Documents\\Development\\purpl-electron-react-vite";
  }
}
