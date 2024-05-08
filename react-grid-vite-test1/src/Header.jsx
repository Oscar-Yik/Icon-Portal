import React, { useState, useEffect } from 'react';
import PopUp from "./PopUp";

import 'bootstrap/dist/css/bootstrap.css';
import './App.css'
import './Background.css'
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '@fortawesome/fontawesome-free/css/all.css';

export default function Header({ blocks2, backImg, headerColor, addBlocks, edit, nameID, delBlocks, location, 
                                navigate, onUpdateBlocks2, onUpdateBackImg, onUpdateHeader, onUpdateAdd, onUpdateEdit, 
                                onUpdateNameID, onUpdateDel }) {

    function updateBackground(trash, newImg) {
        onUpdateBackImg(newImg);
    }

    const handleColorChange = (event) => {
        onUpdateHeader(event.target.value);
    }

    function addBlock() {
        const newBlock2 = { i: `block ${nameID}`, 
                            x: 0, 
                            y: 0, 
                            w: 2, 
                            h: 4, 
                            isBounded: true, 
                            url: "https://chat.openai.com"}; 
        onUpdateAdd([...addBlocks, newBlock2]);
        onUpdateBlocks2([...blocks2, newBlock2]);
        let newNameID = (nameID > 150) ? 0 : nameID + 1; 
        onUpdateNameID(newNameID);
        onUpdateEdit([...edit, {i: newBlock2.i, status: false}]);
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
        onUpdateDel([]);
        
        for (let j = 0; j < addBlocks.length; j++) {
            console.log("Added Block: ", addBlocks[j]);
            requestBlock(addBlocks[j].i, addBlocks[j], "POST");
        }
        onUpdateAdd([]);
        
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
        <div>
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
                    <li className='navItem'>
                        <button className='navButton' onClick={addBlock}>Add Block</button>
                    </li>
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
        </div>
    )
}