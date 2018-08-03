import React from "react";
import Email from "./Email.js";
import jsxToString from 'jsx-to-string';
const submitTicket = (props) => {

    const title = document.getElementById("summary");
    const description = document.getElementById("detailed-description");
    //const clientName = document.getElementById("client-name").value;
    const email = document.getElementById("client-email");
    const category = document.getElementById("category");
    const location = document.getElementById("location");
    const phoneExtension = document.getElementById("phone-extension");
    const officeNumber = document.getElementById("building-number");

    window.onload = () => {

        (function fileAttachment() {
            var file_input = document.getElementById("file-input");
            var fileUpload_inputField = document.getElementById("uploadFile-path");
            
            const getFilePath = (file_input, fileUpload_inputField) => {
                console.log("getFilePath");
                var fileUpload_valueArray = file_input.value.split('\\');
                console.log("fileUpload_valueArray:\t", fileUpload_valueArray);
                fileUpload_inputField.value =  fileUpload_valueArray[fileUpload_valueArray.length - 1];
            }

            document.addEventListener('dragover', function (e) {
                e.preventDefault();
                e.stopPropagation();
              });

            const formGetPathCode = () => {
                file_input.addEventListener("change", (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    console.log("onchange");
                    getFilePath(file_input, fileUpload_inputField);
                    console.log("transfer:\t" + e.dataTransfer);
                   /* for (let f of e.dataTransfer.files) {
                        console.log('File(s) you dragged here: ', f.path)
                      } */

                   // this.value = null; 
                    //return false; 
                });
                /*file_input.onchange = function() {
                    console.log("onchange");
                    getFilePath(file_input, fileUpload_inputField);
        
                    this.value = null; 
                    return false; 
                }; */
            }
        
            if (file_input != null) {
                formGetPathCode();
            }   
        })();
    } //end window.onload

    const sendEmail = (e) => {
        ((e) => {
            e.preventDefault();
            console.log("preventSubmit");
             //return false;
        })(e); 

        const electron = window.require("electron");
        //const {session} = window.require('electron')
       // const ses = session.defaultSession;
        const remote = electron.remote;
        const sendmail = remote.require('sendmail')({silent: true});
        //const jsxToString = remote.require("jsx-to-string");endm
      
       var HTMLmessage =/* jsxToString(<Email title={title} 
                                             description={description}
                                             email={email}
                                             category={category}
                                             location={location}
                                             phoneExtension={phoneExtension}
                                             officeNumber={officeNumber} />
                                    ); */
                                    jsxToString(<Email />).toString();

        console.log("Sent."); 
        console.log("HTMLMessage:\t" + HTMLmessage);
     /*
       sendmail({
            from: email.value,
            to: "juandavidlopez95@yahoo.com",
            subject: title.value,
            html: HTMLmessage,
            attachments: [  {   // file on disk as an attachment
                                filename: 'text3.txt',
                                path: '/path/to/file.txt' // stream this file
                            }
                        ]
          }, function(err, reply) {
            console.log("Sent email!")
            console.log(err && err.stack);
            console.dir(reply);
       });  */

    } //end sendMail() method

   /* const preventSubmit = (e) => {
        e.preventDefault();
        console.log("preventSubmit");
         //return false;
    } */

    return (
        <form className="helpDeskTicket-form" action="https://helpdesk.centinela.k12.ca.us/portal/new_ticket" method="POST" encType="multipart/form-data">
            <fieldset>
                <legend className="form-legend">
                    <h3>Submit Helpdesk Ticket</h3>
                </legend>
                <p>
                    <label htmlFor="summary">Summary/Title:</label>
                    <input type="text" name="summary" id="summary" placeholder="Title or summary of the technical issue..." />
                </p>
                <p>
                    <label htmlFor="detailed-description">Detailed Description:</label>
                    <textarea id="detailed-description" name="detailed-description" placeholder="Type the technical issue you are facing here..." cols="5" rows="3"></textarea>
                </p>
                {/* <p>
                    <label htmlFor="summary">Your name:</label>
                    <input type="text" name="client-name" id="client-name" placeholder="Your full name..." />
                </p> */}
                <p>
                    <label htmlFor="client-email">Centinela E-mail:</label>
                    <input type="email" name="client-email" id="client-email" placeholder="Your Centinela e-mail..." />
                </p>
                <p className="inline fieldMargin">
                    <label htmlFor="category" className="block">Category:</label>
                    <select name="category" id="category">
                            <option>Computer Issue</option>
                            <option>Printer Issue</option>
                            <option>Projector Issue</option>
                            <option>Password Issue</option>
                            <option>Other Type of Issue</option>
                    </select>
                </p>
                <p className="inline fieldMargin">
                    <label htmlFor="location" className="block">Location:</label>
                    <select name="location" id="location">
                            <option>Lawndale</option>
                            <option>Leuzinger</option>
                            <option>Hawthorne</option>
                            <option>Lloyde</option>
                            <option>District Office</option>
                    </select>
                </p>
                <p className="inline fieldMargin">
                    <label htmlFor="phone-extension" className="block">Phone Extension:</label>
                    <input type="tel" name="phone-extension" id="phone-extension" placeholder="7811" />
                </p>
                <p className="inline fieldMargin">
                    <label htmlFor="building-number" className="block">Office/Number #:</label>
                    <input type="text" name="building-number" id="building-number" placeholder="A13" />
                </p>
                <p>
                    <label>Optional Attachment:</label>
                    <label className="fileUpload-button redToDarkRedgradient clickable" htmlFor="file-input">
                            Upload File
                    </label>
                    <input type="file" name="attachment" id="file-input" value="" />

                    <label htmlFor="uploadFile-path">File name:</label>
                    <input type="text" placeholder="Optional file path..." readOnly name="uploadFile-path" id="uploadFile-path" />
                </p>
                <p>
                    <button type="submit" className="redToDarkRedgradient clickable" onClick={sendEmail} >Submit</button>
                    <button type="reset" className="redToDarkRedgradient clickable">Reset</button>
                </p>
            </fieldset>
    </form>
    );
};

export default submitTicket;