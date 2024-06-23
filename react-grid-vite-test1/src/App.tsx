// export default App
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import StaticGridComponent from './layout/StaticGridComponent';
import MyFirstGridComponent from './layout/MyFirstGridComponent';
import AddBlock from './navigation/AddBlock';
import ColorPalette from './navigation/ColorPalette';
import ChangeTheme from './navigation/ChangeTheme';
import SaveTheme from './navigation/SaveTheme';
import HeaderPopup from './navigation/HeaderPopup';
import ChangeBackground from './navigation/ChangeBackground';
import AddWidget from './navigation/AddWidget';
import getErrorMessage from './utils/Errors';
import { themeType, blockType, data_grid_type, blockModalType, colorType, 
         unitType, apiKeys, themeNames, httpRequestType, backImgType } from './grid-types';

import 'bootstrap/dist/css/bootstrap.css';
import './utils/Background.css'
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '@fortawesome/fontawesome-free/css/all.css';

function App() {

  const [blocks2, setBlocks] = useState<blockType[]>([]);
  const [delBlocks, setDelBlocks] = useState<blockType[]>([]);
  const [addBlocks, setAddBlocks] = useState<blockType[]>([]);

  const [backImage, setBackImg] = useState<backImgType>({ id: "current", name: "Sample_Background_2", imgPath: "./src/assets/images/Sample_Background_1.jpg" });
  const [edit, setEdit] = useState<blockModalType[]>([]);
  const [nameID, setNameID] = useState(0);
  const [colors, setColors] = useState<colorType>({ block: "", header: "", headerButton: "", headerFont: "", 
                                                    grid: "", editBox: "", editBoxFont: "" });
  const [dispColPal, setDisColPal] = useState(false);
  const [disTheme, setDisTheme] = useState(false);
  const [disSave, setDisSave] = useState(false);
  const [disBack, setDisBack] = useState(false);
  const [disWid, setDisWid] = useState(false);
  const [theme, setTheme] = useState<themeType>({ name: "", block: "", header: "", headerButton: "", headerFont: "", 
                                                  grid: "", editBox: "", editBoxFont: "", backImg: "" });
  const [bkgImgs, setBkgImgs] = useState<backImgType[]>([
    { id: "1", name: "Sample_Background_1", imgPath: "https://wallpapercave.com/wp/wp13129045.jpg"}, 
    { id: "2", name: "Sample_Background_2", imgPath: "./src/assets/images/Sample_Background_1.jpg" }, 
    { id: "3", name: "Sample_Background_3", imgPath: "./src/assets/images/Sample_Background_2.jpg" }, 
    { id: "4", name: "Sample_Background_4", imgPath: "https://wallpapercave.com/wp/wp13129045.jpg" }, 
    { id: "5", name: "Sample_Background_5", imgPath: "https://wallpapercave.com/wp/wp13129045.jpg" }])

  const navigate = useNavigate();
  const location = useLocation();

  const env_HOSTNAME = import.meta.env.VITE_HOSTNAME;

  async function fetchData(name: apiKeys) {
    try {
      // console.log("call: ", `http://${env_HOSTNAME}:8092/api/blocks`);
      let response;
      if (name === "blocks") {
        response = await fetch(`http://${env_HOSTNAME}:8092/api/blocks`, {method: "GET"}); 
      } else if (name === "theme"){
        response = await fetch(`http://${env_HOSTNAME}:8082/api/themes/current`, {method: "GET"});
      } else {
        response = await fetch(`http://${env_HOSTNAME}:8092/api/units/${name}`, {method: "GET"}); 
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

  function saveColors(db_theme: themeType) {
    const { name, backImg, ...color_copy } = db_theme;
    setColors(color_copy);
  }

  async function getImage(img_name: string) {
    try {
        const response = await fetch(`http://${env_HOSTNAME}:8082/api/s3/${img_name}`, 
                                {method: 'GET'});
        // const fileName = response.headers.get('file_name');
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        return objectURL;
        // let bkg_copy = bkgImgs.slice();
        // bkg_copy[index].imgPath = objectURL;
        // setBkgImgs(bkg_copy);
    } catch (error) {
        console.log("Error retrieving image:", img_name);
        return img_name;
    }
  }

  async function fetchThemes() {
    const names = ["Sample_Background_1.jpg", "Sample_Background_2.jpg", "Sample_Background_3.jpg", 
                    "Sample_Background_4.jpg", "Sample_Background_5.jpg"];
    try {
        for (let i = 0; i < 5; i++) {
            const obj_url = await getImage(names[i])
            if (obj_url) {
              let bkg_copy = bkgImgs.slice();
              bkg_copy[i].name = names[i];
              bkg_copy[i].imgPath = obj_url;
              setBkgImgs(bkg_copy);
            } else {
              console.log("Couldn't retrive image");
            }
                // console.log("Got image:", names[i]); 
        }
    } catch (e) {
        console.log("Couldn't get all images");
    }
  }

  // on startup fetch blocks, background, header color, nameID
  useEffect(() => {
    // console.log("call: ", `http://${env_HOSTNAME}:8082/api/blocks`);

    // getIcon("https://snyk.io/advisor/npm-package/http-proxy-middleware/functions/http-proxy-middleware.createProxyMiddleware").then(icon => {
    //   console.log("Got icon: ", icon);
    // });
    // console.log("use effected :D :D :D");
    fetchData("blocks").then(async (data) => {
      // console.log("blocks: ", data);`
      setBlocks(data);
      let newShowEdit = [];
      for (let i = 0; i < data.length; i++) {
          newShowEdit.push({i: data[i].data_grid.i, status: false});
      }
      setEdit(newShowEdit);
    });

    fetchData("nameID").then((data) => {
      setNameID(parseInt(data.value));
    });

    fetchData("theme").then((data) => {
      // console.log("theme changed: ", data);
      setTheme(data);
      saveColors(data);
      setBackImg(data.backImg);
    });

    fetchThemes()
      .then(() => console.log("Got all images"))
      .catch(e => console.log("uhoh"));
  }, []);

  useEffect(() => {
    const {name, backImg, ...other_colors} = theme; 
    // setBackImg(backImg);
    getImage(backImg)
      .then(obj_url => {
        if (obj_url) {
          setBackImg({ id: "current", name: backImg, imgPath: obj_url });  
        }
      })
      .catch(err => {
        console.log("Couldn't get background image");
      })
    setColors(other_colors);
  }, [theme])

  useEffect(() => {
    console.log("Background Image Changed: ", backImage)
  }, [backImage])

  function updateBackground(trash: any, newImg: string) {
    //setBackImg(newImg);
    const backImage = {backImg: newImg};
    const {backImg: oldImg, ...others} = theme;
    const newTheme = {...backImage, ...others}; 
    console.log("newTheme: ", newImg);
    setTheme(newTheme);
    //updateTheme(newTheme, "current"); 
  }

  async function updateThings(name: unitType, state: string) {
    try {
      const jsonBody = { "key": name, "value": state }; 
      const header = {'Content-Type' : 'application/json'};
      console.log(jsonBody); 
      const response = await fetch(`http://${env_HOSTNAME}:8092/api/units/${name}`, 
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

  function saveGrid(theme_name: themeNames){
    // console.log("addBlocks: ", addBlocks); 
    // console.log("delBlocks: ", delBlocks); 
    // console.log("blocks2: ", blocks2); 
    for (let j = 0; j < delBlocks.length; j++) {
      console.log("Deleted Block: ", delBlocks[j]);
      requestBlock(delBlocks[j].data_grid.i, delBlocks[j], "DELETE");
    }
    setDelBlocks([]);
    
    for (let j = 0; j < addBlocks.length; j++) {
      console.log("Added Block: ", addBlocks[j]);
      requestBlock(addBlocks[j].data_grid.i, addBlocks[j], "POST");
    }
    setAddBlocks([]);
    
    for (let i = 0; i < blocks2.length; i++) {
      console.log(blocks2[i]);
      requestBlock(blocks2[i].data_grid.i, blocks2[i], "PUT");
    }
    console.log(blocks2);
    
    updateThings("nameID", nameID.toString());

    const backgroundImage = {backImg: backImage.name};
    const {name, ...oldColors} = theme;
    const nameObj = {name: name};
    const newTheme = {...nameObj, ...backgroundImage, ...colors}; 
    updateTheme(newTheme, theme_name); 
    updateTheme(newTheme, "current"); 
  }

  async function requestBlock(i: string, block: blockType, type: httpRequestType) {
    try {
      const header = {'Content-Type' : 'application/json'};
      let response;
      if (type === "POST") {
        response = await fetch(`http://${env_HOSTNAME}:8092/api/blocks`, 
                              {method: 'POST', headers: header, body: JSON.stringify(block)});
      } else {
        response = await fetch(`http://${env_HOSTNAME}:8092/api/blocks/${i}`, 
                              {method: type, headers: header, body: JSON.stringify(block)});
      }
      if (!response.ok) {
        throw new Error();
      }
      const data = await response.json();
      return data;
    } catch (e) {
      console.log("Error: cannot", type, "block", getErrorMessage(e));
    }
  }

  async function updateTheme(newTheme: themeType, i: themeNames) {
    try {
      const header = {'Content-Type' : 'application/json'};
      const response = await fetch(`http://${env_HOSTNAME}:8082/api/themes/${i}`, 
                              {method: 'PUT', headers: header, body: JSON.stringify(newTheme)});
      if (!response.ok) {
        throw new Error();
      }
      //console.log("Theme updated: ", newTheme);
    } catch (e) {
      console.log("Error: cannot update theme ", i, ": ", getErrorMessage(e));
    }
  }

  function chooseTheme(newTheme: themeType) {
    setTheme(newTheme);
    console.log("reached: ", newTheme);
    const dbTheme = {...newTheme};
    dbTheme.name = "current";
    updateTheme(dbTheme, "current");
  }

  return (
    <div style={{
        backgroundImage: `url(${backImage.imgPath})`,
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
        <HeaderPopup name="Save" display={disSave} updateDisplay={setDisSave} colors={colors}/>
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
            <li className='wideNavItem' 
                style={{backgroundColor: colors.headerButton, 
                        color: colors.headerFont}}> 
                {disBack && (
                    <div className='box' 
                        onClick={() => setDisBack(false)}></div>)}
                    <button className='navButton' 
                            onClick={() => setDisBack(true)}>Change Background</button>
            </li>
          )}
        {(location.pathname === '/edit-grid') && (
          <HeaderPopup name="Color Palette" display={dispColPal} updateDisplay={setDisColPal} colors={colors}/>
        )}
        {(location.pathname === '/edit-grid') && (
          <HeaderPopup name="Change Theme" display={disTheme} updateDisplay={setDisTheme} colors={colors}/>
        )}
        {(location.pathname === '/edit-grid') && (
          <HeaderPopup name="Add Widget" display={disWid} updateDisplay={setDisWid} colors={colors}/>
        )}
        <ColorPalette display={dispColPal} colors={colors} updateColors={setColors}/>
        <ChangeTheme display={disTheme} colors={colors} theme={theme} updateTheme={chooseTheme} env_HOSTNAME={env_HOSTNAME}/>
        <SaveTheme display={disSave} colors={colors} theme={theme} updateTheme={setTheme} saveGrid={saveGrid} env_HOSTNAME={env_HOSTNAME}/>
        <ChangeBackground display={disBack} colors={colors} env_HOSTNAME={env_HOSTNAME} backImg={backImage} 
                          bkgImgs={bkgImgs} updateBackImg={updateBackground} 
                          updateBkgImgs={(newBkgImgs: backImgType[]) => setBkgImgs(newBkgImgs)}
                          getImage={(img_name: string) => getImage(img_name)}/>
        <AddWidget display={disWid} colors={colors} blocks2={blocks2} addBlocks={addBlocks} edit={edit} 
                   updateBlocks={setBlocks} updateAddBlocks={setAddBlocks} updateEdit={setEdit}/>

        {/* keep this list item or else header buttons become misaligned*/}
        <li className='navColor'>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<StaticGridComponent blocks2={blocks2} colors={colors} delBlocks={delBlocks} 
                onUpdateBlocks2={(newBlocks: blockType[]) => setBlocks(newBlocks)}
                onUpdateDelBlocks={(del: blockType[]) => setDelBlocks(del)}/>} 
        />
        <Route
          path="/edit-grid"
          element={<MyFirstGridComponent blocks2={blocks2} 
                                         delBlocks={delBlocks}
                                         showEdit={edit}
                                         onUpdateBlocks2={(newBlocks: blockType[]) => setBlocks(newBlocks)}
                                         onUpdateDelBlocks={(del: blockType[]) => setDelBlocks(del)}
                                         onUpdateShowEdit={(newEdit: blockModalType[]) => setEdit(newEdit)}
                                         colors={colors}
                                         env_HOSTNAME={env_HOSTNAME}/>}
        />
      </Routes>
    </div>
  );
}

export default App;
