// export default App
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import StaticGridComponent from './StaticGridComponent';
import MyFirstGridComponent from './MyFirstGridComponent';
import AddBlock from './navigation/AddBlock';
import PopUp from "./PopUp";
import ColorPalette from './navigation/ColorPalette';
import ChangeTheme from './navigation/ChangeTheme';
import SaveTheme from './navigation/SaveTheme';

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
  // https://wallpapercave.com/wp/wp13129045.jpg
  // https://images8.alphacoders.com/970/970395.jpg

  const [edit, setEdit] = useState([]);
  const [nameID, setNameID] = useState(0);
  const [colors, setColors] = useState([]);
  const [dispColPal, setDisColPal] = useState(false);
  const [disTheme, setDisTheme] = useState(false);
  const [disSave, setDisSave] = useState(false);
  const [theme, setTheme] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  async function fetchData(name) {
    try {
      let response;
      if (name === "blocks") {
        response = await fetch(`http://localhost:8082/api/blocks`, {method: "GET"}); 
      } else if (name === "theme"){
        response = await fetch(`http://localhost:8082/api/themes/current`, {method: "GET"});
      } else {
        response = await fetch(`http://localhost:8082/api/things/${name}`, {method: "GET"}); 
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

  function saveColors(db_theme) {
    const { name, backImg, ...color_copy } = db_theme;
    setColors(color_copy);
  }

  // on startup fetch blocks, background, header color, nameID
  useEffect(() => {
    fetchData("blocks").then(async (data) => {
      setBlocks(data);
      let newShowEdit = [];
      for (let i = 0; i < data.length; i++) {
          newShowEdit.push({i: data[i].i, status: false});
      }
      setEdit(newShowEdit);
    });

    // fetchData("background").then((data) => {
    //   setBackImg(data.url);
    // });

    // fetchData("color").then((data) => {
    //   setColors(data);
    // });

    fetchData("nameID").then((data) => {
      setNameID(parseInt(data.url));
    });

    fetchData("theme").then((data) => {
      setTheme(data);
      saveColors(data);
      setBackImg(data.backImg);
    });

  }, []);

  function updateBackground(trash, newImg) {
    setBackImg(newImg);
    const backImage = {backImg: newImg};
    const {backI, ...others} = theme;
    const newTheme = {...backImage, ...others}; 
    console.log("newTheme: ", newImg);
    updateTheme(newTheme, "current"); 
  }

  async function updateThings(name, state) {
    try {
      const jsonBody = {"url": state}; 
      const header = {'Content-Type' : 'application/json'};
      console.log(jsonBody); 
      const response = await fetch(`http://localhost:8082/api/things/${name}`, 
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

  function saveGrid(theme_name){
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
    
    // updateThings("backgroundImage", backImg);
    // updateThings("header", headerColor);
    // colors.forEach(obj => {
    //   updateThings(obj.type, obj.url);
    // })
    updateThings("nameID", nameID.toString());

    const backImage = {backImg: backImg};
    const {name, backI, ...oldColors} = theme;
    const newTheme = {...name, ...backImage, ...colors}; 
    updateTheme(newTheme, theme_name); 
    updateTheme(newTheme, "current"); 
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

  async function updateTheme(newTheme, i) {
    try {
      const header = {'Content-Type' : 'application/json'};
      const response = await fetch(`http://localhost:8082/api/themes/${i}`, 
                              {method: 'PUT', headers: header, body: JSON.stringify(newTheme)});
      if (!response.ok) {
        throw new Error();
      }
    } catch (e) {
      console.log("Error: cannot update theme ", i, ": ", e.message);
    }
  }

  function getColor(key) {
    // const index = colors.findIndex(obj => obj.type === key);
    // if (index !== -1) {
    //   return colors[index].url;
    // } else {
    //   // console.log("cannot get color");
    //   return "#FFFFFF";
    // } 
  }

  return (
    <div style={{
        backgroundImage: `url(${backImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover', 
        backgroundPosition: 'center'
      }}>
      <ul className="nav" 
          style={{ backgroundColor: colors.header }}>
        <li className="navItem" 
            style={{backgroundColor: colors.headerButton, 
                    color: colors.headerFont}}>
          <button className='navLink' 
                  onClick={() => {navigate("/")}}>Home</button>
        </li>
        <li className="navItem" 
            style={{backgroundColor: colors.headerButton, 
              color: colors.headerFont}}> 
            {disSave && (
                <div className='box' 
                    onClick={() => setDisSave(false)}></div>)}
                <button className='navButton' 
                        onClick={() => setDisSave(true)}>Save</button>
        </li>
        {(location.pathname !== '/edit-grid') && (
          <li className="navItem" 
              style={{backgroundColor: colors.headerButton, 
                      color: colors.headerFont}}>
            <button className='navLink' 
                    onClick={() => {navigate("/edit-grid")}}>Edit</button>
          </li>
        )}
        {(location.pathname === '/edit-grid') && (
          <AddBlock blocks2={blocks2} addBlocks={addBlocks} nameID={nameID} edit={edit} updateBlocks={setBlocks}
                    updateAddBlocks={setAddBlocks} updateNameID={setNameID} updateEdit={setEdit} colors={colors}/>
        )}
        {(location.pathname === '/edit-grid') && (
          <li className="wideNavItem" 
              style={{backgroundColor: colors.headerButton, 
                      color: colors.headerFont}}> 
            <PopUp backImg={backImg} UpdateBackImg={updateBackground}/>
          </li>
        )}
        {(location.pathname === '/edit-grid') && (
          <li className='navItem' 
              style={{backgroundColor: colors.headerButton, 
                      color: colors.headerFont}}> 
              {dispColPal && (
                  <div className='box' 
                       onClick={() => setDisColPal(false)}></div>)}
                  <button className='navButton' 
                          onClick={() => setDisColPal(true)}>Color Palette</button>
          </li>
        )}
        {(location.pathname === '/edit-grid') && (
          <li className='navItem' 
              style={{backgroundColor: colors.headerButton, 
                      color: colors.headerFont}}> 
              {disTheme && (
                  <div className='box' 
                       onClick={() => setDisTheme(false)}></div>)}
                  <button className='navButton' 
                          onClick={() => setDisTheme(true)}>Change Theme</button>
          </li>
        )}
        <ColorPalette display={dispColPal} colors={colors} updateColors={setColors} getColor={getColor}/>
        <ChangeTheme display={disTheme} colors={colors} theme={theme} updateTheme={setTheme}/>
        <SaveTheme display={disSave} colors={colors} theme={theme} updateTheme={setTheme} saveGrid={saveGrid}/>
        <li className='navColor'>
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
                                         onUpdateShowEdit={(newEdit) => setEdit(newEdit)}
                                         colors={colors}/>}
        />
      </Routes>
    </div>
  );
}

export default App;
