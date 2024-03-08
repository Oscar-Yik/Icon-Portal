// export default App
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StaticGridComponent from './StaticGridComponent';
import MyFirstGridComponent from './MyFirstGridComponent';

import axios from 'axios';

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

  //const [info, setInfo] = useState(["https://chat.openai.com", "https://chat.openai.com", "https://chat.openai.com"]);

  const [info, setInfo] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8082/api/blocks')
      .then((res) => {
        // parse the JSON data
        parseJson(res.data);
      })
      .catch((err) => {
        console.log('Error from Layout');
      });
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

  function saveGrid(){
    layout.map((el) => {
      deleteElement(el.i); 
    });
    for (let i = 0; i < layout.length; i++) {
      postElement(layout[i],info[i]);
    }
  }

  function deleteElement(i) {
    axios 
      .delete(`http://localhost:8082/api/blocks/${i}`)
      .then((res) => {
        console.log('Block Deleted');
      })
      .catch((err) => {
        console.log('Error in Delete Block!');
      });
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

    axios
      .post(`http://localhost:8082/api/blocks`, block)
      .then((res) => {
        console.log('Block Posted');
      })
      .catch((err) => {
        console.log('Error in UpdateBookInfo!');
      });
  }

  return (
    <Router>
      <div>
        <ul class="nav nav-pills nav-fill">
          <li class="nav-item">
            <Link class="nav-link" data-toggle="pill" to="/">Home</Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" data-toggle="pill" to="/edit-grid">Edit</Link>
          </li>
        </ul>
        <button type="button" class="btn btn-outline-info" onClick={saveGrid}>Save</button>
        <Routes>
          <Route path="/" element={<StaticGridComponent layout={layout} info={info} />} />
          <Route
            path="/edit-grid"
            element={<MyFirstGridComponent layout={layout} info={info} onUpdateLayout={handleGridLayout} onUpdateInfo={handleGridInfo} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
