// PopUp.jsx 

import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import EditableTextItem from './EditableText';
import "./Background.css"

export default function PopUp({ backImg, UpdateBackImg }) {
    return (
        <div>
            <Popup trigger=
                {<button className="navButton" type="button">Change Background</button>}
                modal nested>
                    {close => (
                        <div>
                            <div>
                                <EditableTextItem key={69} 
                                                  initialText={backImg} 
                                                  id={420} 
                                                  onStateChange={UpdateBackImg}/>
                            </div>
                            <div>
                                <button onClick=
                                    {() => close()}>
                                        Close Modal
                                </button>
                            </div>
                        </div>
                    )}
            </Popup>
        </div>
    )
};
