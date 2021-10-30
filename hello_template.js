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
                <div><p><b>Hi ${name},</b><br/>
                Welcome to the <b>noti5 app<b>.<br/>
                To verify your e-mail id, enter the OTP <br/><br/> <b> ${id} </b> <br/><br/> in the app.
                </p></div>
                <br />
                <br />
             </body>
     
       </html>
      `;
  };
  
  module.exports = { Hello };
  
