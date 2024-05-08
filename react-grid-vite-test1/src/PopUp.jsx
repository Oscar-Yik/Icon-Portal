// PopUp.jsx 

import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import EditableTextItem from './EditableText';

export default function PopUp({ backImg, UpdateBackImg }) {
    return (
        <div>
            <Popup trigger=
                {<button type="button" 
                         className="btn btn-outline-warning">Change Background Image</button>}
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
