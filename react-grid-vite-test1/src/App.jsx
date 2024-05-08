// export default App
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StaticGridComponent from './StaticGridComponent';
import MyFirstGridComponent from './MyFirstGridComponent';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css'
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

function App() {
  // const [layout, setLayout] = useState([
  //   { i: "a", x: 4, y: 0, w: 1, h: 2, isBounded: true },
  //   { i: "b", x: 4, y: 0, w: 1, h: 2, isBounded: true },
  //   { i: "c", x: 4, y: 0, w: 1, h: 2, isBounded: true }
  // ]);

  const [layout, setLayout] = useState([]);

  const [info, setInfo] = useState([]);
  const [backImg, setBackImg] = useState("");
  // https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/129325364/original/afaddcb9d7dfaaf5bff7ef04101935814665ac16/design-an-attractive-background-for-your-website.png
  // https://images.saymedia-content.com/.image/t_share/MTc4NzM1OTc4MzE0MzQzOTM1/how-to-create-cool-website-backgrounds-the-ultimate-guide.png


  // improved on block change 
  useEffect(() => {
    async function fetchBlocks() {
      try {
        const response = await fetch("http://localhost:8082/api/blocks", {method: "GET"}); 
        if (!response.ok) {
          console.log("Bad Query: blocks");
        }
        const data = await response.json();
        parseJson(data);
      } catch (e) {
        console.log("Error: couldn't get blocks");
      }
    }
    fetchBlocks();
  }, []);

  // // on background image change 
  useEffect(() => {
    async function fetchBackground() {
      try {
        const response = await fetch("http://localhost:8082/api/blocks/background", {method: "GET"});
        if (!response.ok) {
          console.log("Bad Query: background");
        }
        const image = await response.json();
        setBackImg(image.url);
      } catch (e) {
        console.log("Error: background image problems");
      }
    }
    fetchBackground();
  }, []);

  function parseJson(blocks) {
    var urls = [];
    var layouts = []; 
    //blocks.map((block) => array.push(block));
    blocks.map((block) => {
      urls.push(block.url);
      delete block._id;
      delete block.__v;
      delete block.url;
      layouts.push(block);
    });
    //console.log(test);
    setLayout(layouts);
    setInfo(urls);
  }

  function handleGridLayout(newLayout) {
    setLayout(newLayout);
  }

  function handleGridInfo(newInfo) {
    setInfo(newInfo);
  }

  function handleGridBackImg(newBackImg) {
    setBackImg(newBackImg);
  }

  function saveGrid(){
    async function updateBack() {
      try {
        const jsonBody = {"url": backImg}; 
        const header = {'Content-Type' : 'application/json'};
        console.log(jsonBody); 
        const response = await fetch("http://localhost:8082/api/blocks/background", 
                                     {method: 'PUT', headers: header, body: JSON.stringify(jsonBody)});
        if (!response.ok) {
          console.log("Bad Query: background");
        }
        const data = await response.json();
        console.log(data);
        console.log(response.status);
      } catch (e) {
        console.log("Error: cannot update background image");
      }
    }

    layout.map((el) => {
      deleteElement(el.i); 
    });
    for (let i = 0; i < layout.length; i++) {
      postElement(layout[i],info[i]);
    }
    updateBack();
  }

  function deleteElement(i) {
    async function deleteElem() {
      try {
        const response = await fetch(`http://localhost:8082/api/blocks/${i}`, 
                                     {method: 'DELETE'});
        if (!response.ok) {
          throw new Error();
        }
      } catch (e) {
        console.log("Error in Delete Block:", e.message);
      }
    }
    deleteElem();
  }

  function postElement(el, url) {
    const block = {
      i: el.i, 
      x: el.x, 
      y: el.y,
      w: el.w,
      h: el.h,
      isBounded: true, 
      url: url,
    };
    
    async function postElem() {
      try { 
        const header = {'Content-Type' : 'application/json'};
        const response = await fetch("http://localhost:8082/api/blocks", 
                                     {method: 'POST', headers: header, body: JSON.stringify(block)});
        if (!response.ok) {
          throw new Error();
        }
      } catch (e) {
        console.log("Error: cannot update background image", e.message);
      }
    }
    postElem();
  }

  return (
    <Router>
      <div style={{
          backgroundImage: `url(${backImg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover', 
          backgroundPosition: 'center'
        }}>
        <ul className="nav nav-pills nav-fill">
          <li className="nav-item">
            <Link className="nav-link" data-toggle="pill" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" data-toggle="pill" to="/edit-grid">Edit</Link>
          </li>
        </ul>
        <button type="button" className="btn btn-outline-info" onClick={saveGrid}>Save</button>
        <Routes>
          <Route path="/" element={<StaticGridComponent layout={layout} info={info} />} />
          <Route
            path="/edit-grid"
            element={<MyFirstGridComponent layout={layout} 
                                           info={info} 
                                           backImg={backImg} 
                                           onUpdateLayout={handleGridLayout} 
                                           onUpdateInfo={handleGridInfo} 
                                           onUpdateBackImg={handleGridBackImg}/>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
