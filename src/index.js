import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import Photos from "./routes/photos";
import July2022 from "./routes/july2022";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="photos" element={<Photos />} />
        <Route path="july2022" element={<July2022 />} />
      </Route>
    </Routes>
  </BrowserRouter>
);