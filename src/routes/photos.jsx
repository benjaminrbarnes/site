import { Outlet, Link } from "react-router-dom";
export default function Expenses() {
  return (
    <main>
      <nav>
        <div class="row">
            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/july2022"><img class="img-fluid" src="https://s3.us-west-2.amazonaws.com/benjaminbarnes.co/photos/8-25-2022/2/md/img1.jpg"/></Link>
                <div class="card-body">
                  <Link to="/july2022"><p class="card-text">Late July 2022</p></Link>
                  <p class="card-text">Pool with Payton / Visiting Zach in LA </p>
                </div>
              </div>
            </div>
          
            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/july2022"><img class="img-fluid" src="https://s3.us-west-2.amazonaws.com/benjaminbarnes.co/photos/8-25-2022/1/md/img1.jpg"/></Link>
                <div class="card-body">
                  <Link to="/july2022"><p class="card-text">Early July 2022</p></Link>
                  <p class="card-text">St. Theresa beach / Braves game </p>
                </div>
              </div>
            </div>
          
        </div>
      </nav>
    </main>
  );
}