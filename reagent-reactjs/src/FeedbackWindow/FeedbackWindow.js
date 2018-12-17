import React, { Component } from "react";
import ReactDOMServer from "react-dom/server";
import Titlebar from "./Titlebar/Titlebar.js";

import styles from "./FeedbackWindow.css";

//Import form components
import Select from "./../form-components/Select/Select.js";
import SingleInput from "./../form-components/SingleInput/SingleInput.js";
import TextArea from "./../form-components/TextArea/TextArea.js";
import FormButton from "./../form-components/FormButton/FormButton.js";

//Import external components - ES6 JavaScript
import Email from "./../Email.js";

//Import nice utility functions
import { popNotification, isNullOrUndefinedOrEmptyString } from "./../utilityFunctions.js";

class FeedbackWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitEmailMessage: "",
            emailSuccess: "",
            emailMessage: {
                title: "",
                description: "",
                email: "",
                category: "Computer Issue"
            } //end emailMessage object
        } //end state object
    } //end constructor

    generateResultIcon = () => {
        if (this.state.emailSuccess === "" ) {
            return null; 
        } else {
            return this.state.emailSuccess ? (<i class="fa fa-check green-success" aria-hidden="true"></i> ) :
                                             (<i class="fa fa-times red-fail" aria-hidden="true"></i>);
        } //end else-statement
    }; //end generateResultIcon()

    sendEmail = (e) => {
        console.log("sendEmail(e)");
        ((e) => {
            e.preventDefault();
            console.log("preventSubmit");
             //return false;
        })(e); 

       if ( isNullOrUndefinedOrEmptyString(this.state.emailMessage.description) ||
            isNullOrUndefinedOrEmptyString(this.state.emailMessage.email) ||
            isNullOrUndefinedOrEmptyString(this.state.emailMessage.officeNumber) ||
            isNullOrUndefinedOrEmptyString(this.state.emailMessage.phoneExtension) ||
            isNullOrUndefinedOrEmptyString(this.state.emailMessage.title) ) {
                console.log("Undefined/null fields!");
                this.setState({submitEmailMessage: "Please fill out all the fields!"});           
        } else { 
            const sendmail = window.require("sendmail")({silent: true});

            const emailJSX = ( <Email title={this.state.emailMessage.title} 
                                    description={this.state.emailMessage.description}
                                    email={this.state.emailMessage.email}
                                    category={this.state.emailMessage.category}
                                    location={this.state.emailMessage.location}
                                    phoneExtension={this.state.emailMessage.phoneExtension}
                                    officeNumber={this.state.emailMessage.officeNumber} />);
           
           const HTMLmessage =  ReactDOMServer.renderToStaticMarkup(emailJSX);

           console.log("HTMLMessage:\t" + HTMLmessage);

           sendmail({
                from: this.state.emailMessage.email,
                to: "juandavidlopez95@yahoo.com",
                subject: this.state.emailMessage.title,
                html: HTMLmessage,
                attachments: [  {   // file on disk as an attachment
                        filename: this.state.emailMessage.fileAttachmentName,
                        path: this.state.emailMessage.fileAttachmentPath // stream this file
                    }
                ]
              }, (err, reply) => {
                if (err) {
                    console.log(err && err.stack);
                    console.dir(reply);
                    this.setState({submitEmailMessage: "Error sending e-mail."});   
                    this.setState({ emailSuccess: false});
                    popNotification("Error sending e-mail", "Please try again");
                    return;
                } else {
                    console.log("Successfully sent email!");
                    console.dir(reply);
                    this.setState({submitEmailMessage: "HelpDesk e-mail sent"}); 
                    this.setState({ emailSuccess: true});
                    popNotification("Email sent!", "Success!");
                    return;
                } //end else-statement
           });  
        } //end else-statement
    }; //end sendMail() method

    render = () => {
        return (
            <div id="fb-container" className="noDrag">
                <Titlebar />
                <section className="fb-page-content">
                    <div id="fb-form-container">
                        <form action="#">
                            <fieldset id="fb-fieldset">
                                <legend className="noHighlight">
                                    <h2 id="fb-title">Provide Feedback</h2>
                                </legend>
                                <p className="fb-inputContainer noHighlight">
                                    <Select 
                                        label={true} 
                                        id="fb-category" 
                                        labelTitle="Category:" 
                                        labelClassName="block" 
                                        options={["Computer Issue", "Printer Issue", "Projector Issue", "Password Issue", "Other Type of Issue"]} 
                                        placeholder="Problem Categories"
                                        selectedOption="Computer Issue"
                                        
                                        controlFunc=""
                                        
                                    />
                                </p>
                                <p className="fb-inputContainer noHighlight">
                                    <SingleInput label={true} labelID="fb-subject-label"
                                        labelTitle="Subject:" inputType="text" 
                                        id="fb-subject-input" placeholder="Insert tile here..."  
                                        controlFunc=""
                                    />
                                </p>
                                <p className="fb-inputContainer noHighlight"> 
                                    <TextArea label={true} labelTitle="Description:" 
                                        id="fb-description" cols={5} rows={3}  
                                        placeholder="Let us know what you think of WayPoint! What features we can improve on, add, or even remove." 
                                        resize="none" 
                                        controlFunc=""
                                    />
                                </p>
                                <p className="fb-inputContainer noHighlight" id="fb-formButtons-container">
                                    <FormButton inputType="submit" className="clickable fb-form-buttons" id="fb-submit" buttonTitle="Submit" controlFunc="" />
                                    <FormButton inputType="reset" className="clickable  fb-form-buttons"  id="fb-reset" buttonTitle="Reset" controlFunc=""/>
                                </p>
                                <p className="poweredBy noHighlight">
                                 Powered by: The CV-way   
                                </p>
                            </fieldset>
                        </form>
                       
                    </div>
                </section>
            </div>
        ); //end return statement
    }; //end render method
} //end FeedbackWindow class

export default FeedbackWindow;