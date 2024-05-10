// export default App
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import StaticGridComponent from './StaticGridComponent';
import MyFirstGridComponent from './MyFirstGridComponent';
import Header from './Header';
import AddBlock from './navigation/AddBlock';
import PopUp from "./PopUp";

import 'bootstrap/dist/css/bootstrap.css';
import './Background.css'
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '@fortawesome/fontawesome-free/css/all.css';

function App() {

  const [blocks2, setBlocks] = useState([]);
  const [delBlocks, setDelBlocks] = useState([]);
  const [addBlocks, setAddBlocks] = useState([]);

  const [backImg, setBackImg] = useState("");
  // https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/129325364/original/afaddcb9d7dfaaf5bff7ef04101935814665ac16/design-an-attractive-background-for-your-website.png
  // https://images.saymedia-content.com/.image/t_share/MTc4NzM1OTc4MzE0MzQzOTM1/how-to-create-cool-website-backgrounds-the-ultimate-guide.png

  const [headerColor, setHeaderColor] = useState("#000000");
  const [edit, setEdit] = useState([]);
  const [nameID, setNameID] = useState(0);
  const [colors, setColors] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const handleColorChange = (event) => {
    setHeaderColor(event.target.value);
  }

  async function fetchData(name) {
    try {
      let response;
      if (name === "blocks") {
        response = await fetch(`http://localhost:8082/api/blocks`, {method: "GET"}); 
      } else {
        response = await fetch(`http://localhost:8082/api/blocks/${name}`, {method: "GET"}); 
      }
      if (!response.ok) {
        console.log("Bad Query: ", name);
      }
      const data = await response.json();
      return data;
    } catch (e) {
      console.log("Error: couldn't get ", name);
    }
  }

  // on startup fetch blocks, background, header color, nameID
  useEffect(() => {
    fetchData("blocks").then(async (data) => {
      // parseJson(data);
      setBlocks(data);
      let newShowEdit = [];
      for (let i = 0; i < data.length; i++) {
          newShowEdit.push({i: data[i].i, status: false});
      }
      setEdit(newShowEdit);
    });

    fetchData("background").then((data) => {
      setBackImg(data.url);
    });

    fetchData("color").then((data) => {
      setHeaderColor(data.url);
    });

    fetchData("nameID").then((data) => {
      setNameID(data.url);
    });
  }, []);

  // async function parseJson(blocks) {
  //   let b2 = [];
  //   blocks.map((block) => {
  //     delete block._id;
  //     delete block.__v;
  //     b2.push(block);
  //   });
  //   console.log("called parseJSON: ", b2);
  //   setBlocks(b2);
  // }

  function updateBackground(trash, newImg) {
    setBackImg(newImg);
  }

  async function updateThings(name, state) {
    try {
      const jsonBody = {"url": state}; 
      const header = {'Content-Type' : 'application/json'};
      console.log(jsonBody); 
      const response = await fetch(`http://localhost:8082/api/blocks/${name}`, 
                                   {method: 'PUT', headers: header, body: JSON.stringify(jsonBody)});
      if (!response.ok) {
        console.log("Bad Query: ", name);
      }
      const data = await response.json();
      console.log(data);
      console.log(response.status);
    } catch (e) {
      console.log("Error: cannot update ", name);
    }
  }

  function saveGrid(){
    for (let j = 0; j < delBlocks.length; j++) {
      console.log("Deleted Block: ", delBlocks[j]);
      requestBlock(delBlocks[j].i, delBlocks[j], "DELETE");
    }
    setDelBlocks([]);
    
    for (let j = 0; j < addBlocks.length; j++) {
      console.log("Added Block: ", addBlocks[j]);
      requestBlock(addBlocks[j].i, addBlocks[j], "POST");
    }
    setAddBlocks([]);
    
    for (let i = 0; i < blocks2.length; i++) {
      console.log(blocks2[i]);
      requestBlock(blocks2[i].i, blocks2[i], "PUT");
    }
    console.log(blocks2);
    
    updateThings("background", backImg);
    updateThings("color", headerColor);
    updateThings("nameID", nameID.toString());
  }

  async function requestBlock(i, block, type) {
    try {
      const header = {'Content-Type' : 'application/json'};
      let response;
      if (type === "POST") {
        response = await fetch("http://localhost:8082/api/blocks", 
                              {method: 'POST', headers: header, body: JSON.stringify(block)});
      } else {
        response = await fetch(`http://localhost:8082/api/blocks/${i}`, 
                              {method: type, headers: header, body: JSON.stringify(block)});
      }
      if (!response.ok) {
        throw new Error();
      }
      const data = await response.json();
      return data;
    } catch (e) {
      console.log("Error: cannot", type, "block", e.message);
    }
  }

  return (
    <div style={{
        backgroundImage: `url(${backImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover', 
        backgroundPosition: 'center'
      }}>
      <ul className="nav" style={{ backgroundColor: headerColor }}>
        <li className="navItem">
          <button className='navLink' onClick={() => {navigate("/")}}>Home</button>
        </li>
        <li className="navItem">
          <button className="navButton" type="button" onClick={saveGrid}>Save</button>
        </li>
        <li className="navItem">
          <button className='navLink' onClick={() => {navigate("/edit-grid")}}>Edit</button>
        </li>
        {(location.pathname === '/edit-grid') && (
          <AddBlock blocks2={blocks2} addBlocks={addBlocks} nameID={nameID} edit={edit} updateBlocks={setBlocks}
                    updateAddBlocks={setAddBlocks} updateNameID={setNameID} updateEdit={setEdit}/>
        )}
        {(location.pathname === '/edit-grid') && (
          <li className="wideNavItem"> 
            <PopUp backImg={backImg} UpdateBackImg={updateBackground}/>
          </li>
        )}
        <li className='navColor'>
          <input type="color" value={headerColor} onChange={handleColorChange}/>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<StaticGridComponent blocks2={blocks2}/>} />
        <Route
          path="/edit-grid"
          element={<MyFirstGridComponent blocks2={blocks2} 
                                         delBlocks={delBlocks}
                                         showEdit={edit}
                                         onUpdateBlocks2={(newBlocks) => setBlocks(newBlocks)}
                                         onUpdateDelBlocks={(del) => setDelBlocks(del)}
                                         onUpdateShowEdit={(newEdit) => setEdit(newEdit)}/>}
        />
      </Routes>
    </div>
  );
}

export default App;
