import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div class="container">
      <h1>Ben Barnes</h1>
      <Link to="/">Home</Link> | <Link to="/photos/gallery">Photos</Link>
      <Outlet />
    </div>
  );
}
