import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div class="container">
      <h1>Ben Barnes</h1>
      <Link to="/">Photos</Link> | <Link to="/notepad">Notepad</Link> | <Link to="/contact">Contact</Link>
      <Outlet/>
    </div>
  );
}
