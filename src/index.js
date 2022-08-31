import ReactDOM from "react-dom/client";
import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";

import Contact from "./views/contact";

import Gallery from "./photos/gallery";
import LateJuly2022 from "./photos/lateJuly2022";
import EarlyJuly2022 from "./photos/earlyJuly2022";
import P1 from "./photos/p1";
import P2 from "./photos/p2";
import P3 from "./photos/p3";
import P4 from "./photos/p4";
import P5 from "./photos/p5";
import P6 from "./photos/p6";
import P7 from "./photos/p7";
import P8 from "./photos/p8";
import P9 from "./photos/p9";
import P10 from "./photos/p10";
import P11 from "./photos/p11";
import P12 from "./photos/p12";
import P13 from "./photos/p13";
import P14 from "./photos/p14";
import P15 from "./photos/p15";
import P16 from "./photos/p16";
import P17 from "./photos/p17";


const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Gallery />}/>
        <Route path="/contact" element={<Contact />}/>

        <Route path="photos/p1" element={<P1 />}/>
        <Route path="photos/p2" element={<P2 />}/>
        <Route path="photos/p3" element={<P3 />}/>
        <Route path="photos/p4" element={<P4 />}/>
        <Route path="photos/p5" element={<P5 />}/>
        <Route path="photos/p6" element={<P6 />}/>
        <Route path="photos/p7" element={<P7 />}/>
        <Route path="photos/p8" element={<P8 />}/>
        <Route path="photos/p9" element={<P9 />}/>
        <Route path="photos/p10" element={<P10 />}/>
        <Route path="photos/p11" element={<P11 />}/>
        <Route path="photos/p12" element={<P12 />}/>
        <Route path="photos/p13" element={<P13 />}/>
        <Route path="photos/p14" element={<P14 />}/>
        <Route path="photos/p15" element={<P15 />}/>
        <Route path="photos/lateJuly2022" element={<LateJuly2022 />}/>
        <Route path="photos/earlyJuly2022" element={<EarlyJuly2022 />}/>
        <Route path="photos/p16" element={<P16 />}/>
        <Route path="photos/p17" element={<P17 />}/>
      </Route>
    </Routes>
  </BrowserRouter>
);
