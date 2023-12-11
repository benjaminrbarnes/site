import { Outlet, Link } from "react-router-dom";
export default function Gallery() {
  return (
    <main>
      <p>
        Photos are separated by roll, not event. <br/>
        Please contact me for full resolution images.

      </p>

      <nav>
        <div class="row">
            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p25"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/25/md/img21.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p25"><p class="card-text">June 2023 - Sept 2023</p></Link>
                  <p class="card-text">Camping / 4th of July / Cruise / Lake House / DIY / Tahoe</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p24"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/24/md/img19.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p24"><p class="card-text">March 2023 - Pt. 4</p></Link>
                  <p class="card-text">Hawaii / Half Marathon (Bend)</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p23"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/23/md/img34.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p23"><p class="card-text">March 2023 - Pt. 3</p></Link>
                  <p class="card-text">Kauai / Hawaii</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p22"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/22/md/img16.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p22"><p class="card-text">March 2023 - Pt. 2</p></Link>
                  <p class="card-text">Honolulu / Kauai </p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p21"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/21/md/img12.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p21"><p class="card-text">March 2023 - Pt. 1</p></Link>
                  <p class="card-text">Seattle / Pizza / Juno</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p20"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/20-feb2023/md/img12.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p20"><p class="card-text">Jan & Feb 2023</p></Link>
                  <p class="card-text">North GA / Seattle Trip</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p19"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/19-dec2022/md/img3.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p19"><p class="card-text">Nov & Dec 2022</p></Link>
                  <p class="card-text">Christmas / New Years</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p18"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/18-aug2022/md/img19.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p18"><p class="card-text">Sept - Nov 2022</p></Link>
                  <p class="card-text">New house / Halloween / Thanksgiving</p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p17"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/17-july2022-2/md/img31.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p17"><p class="card-text">Aug 2022</p></Link>
                  <p class="card-text">Scott & Connie Wedding</p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p16"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/16-july2022-1/md/img34.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p16"><p class="card-text">July & Aug 2022</p></Link>
                  <p class="card-text">Visiting Zach & Eliz in LA / Scott & Connie Wedding</p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/lateJuly2022"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/8-25-2022/2/md/img28.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/lateJuly2022"><p class="card-text">July 2022 - 2</p></Link>
                  <p class="card-text">Pool with Payton / Visiting Zach & Eliz in LA </p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/earlyJuly2022"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/8-25-2022/1/md/img18.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/earlyJuly2022"><p class="card-text">July 2022</p></Link>
                  <p class="card-text">St. Theresa beach / Braves game </p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p15"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/15-june2022-4/md/img11.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p15"><p class="card-text">June 2022 - July 2022</p></Link>
                  <p class="card-text">Peter's wedding / ATL Apartment</p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p14"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/14-june2022-3/md/img26.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p14"><p class="card-text">June 2022 - 3</p></Link>
                  <p class="card-text">Peter's wedding</p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p13"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/13-june2022-2/md/img16.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p13"><p class="card-text">June 2022 - 2</p></Link>
                  <p class="card-text">Scott Bachelor Party / Colorado / Peter's wedding</p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p12"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/12-june2022-1/md/img24.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p12"><p class="card-text">June 2022</p></Link>
                  <p class="card-text">Scott Bachelor Party / Austin, TX</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p11"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/11-feb2022/md/img17.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p11"><p class="card-text">Feb 2022 - June 2022</p></Link>
                  <p class="card-text">Park City / Lily visit CO / Scott Bachelor Austin TX</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p10"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/10-nov2021/md/img29.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p10"><p class="card-text">Nov 2021 - Feb 2022</p></Link>
                  <p class="card-text">North GA / Colorado / Park City / Peter's Bachelor</p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p9"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/9-oct2021/md/img22.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p9"><p class="card-text">Sept 2021 - Nov 2021</p></Link>
                  <p class="card-text">Roadtrip / Colorado / Seattle</p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p8"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/8-sept2021-6/md/img19.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p8"><p class="card-text">Sept & Oct 2021</p></Link>
                  <p class="card-text">Zurich / Chris / Grandma / Atlanta /  Van</p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p7"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/7-sept2021-5/md/img10.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p7"><p class="card-text">Sept 2021 - 5</p></Link>
                  <p class="card-text">Matterhorn / Lauterbrunnen / Jungfraujoch / First</p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p6"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/6-sept2021-4/md/img11.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p6"><p class="card-text">Sept 2021 - 4</p></Link>
                  <p class="card-text">Venice / Milan / Zermatt / Matterhorn </p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p5"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/5-sept2021-3/md/img2.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p5"><p class="card-text">Sept 2021 - 3</p></Link>
                  <p class="card-text">Florence / Venice</p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p4"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/4-sept2021-2/md/img19.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p4"><p class="card-text">Sept 2021 - 2</p></Link>
                  <p class="card-text">Positano / Capri</p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p3"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/3-sept2021-1/md/img23.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p3"><p class="card-text">Sept 2021 - 1</p></Link>
                  <p class="card-text">Rome / Vatican</p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p2"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/2-aug2021-2/md/img26.jpg"/></Link>
                <div class="card-body">
                  <Link to="/photos/p2"><p class="card-text">Aug & Sept 2021</p></Link>
                  <p class="card-text">Time in NYC / Rome, Italy</p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card mb-4 shadow-sm">
                <Link to="/photos/p1"><img class="img-fluid" src="https://d3dsxdu5t5tqsc.cloudfront.net/photos/1-aug2021-1/md/img36.JPG"/></Link>
                <div class="card-body">
                  <Link to="/photos/p1"><p class="card-text">Aug 2021</p></Link>
                  <p class="card-text">New camera / time in NYC</p>
                </div>
              </div>
            </div>

        </div>
      </nav>
    </main>
  );
}
