const Hello = (name,id) => {

    return `
      <!DOCTYPE html>
     <html style="margin: 0; padding: 0;">
     
         <head>
             <title>Mail Verification</title>
         </head>
     
             <body style="margin: 0; padding: 0;">
                <br />
                <br />
                <div><p><b>Hi ${name}</b><br/>
                You have signed in into noti5 app for the first time.<br/>
                To verify your mail enter the id <br/> <b> ${id} </b> <br/> in the app.
                </p></div>
                <br />
                <br />
             </body>
     
       </html>
      `;
  };
  
  module.exports = { Hello };
  