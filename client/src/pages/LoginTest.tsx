import React from 'react';
interface AppState {
  group_id?: string,
  user?: User
}

interface User {
  user_id: String,
  name: String
}

declare global {
  interface Window {
    responseGoogle: any;
  }
}



class LoginTest extends React.Component<any, AppState> {

  constructor(props: any) {
    super(props)

    this.state = {
      // user: {
      //   user_id: "username",
      //   name: "Karthik Macherla"
      // }
    }

    window.responseGoogle = this.responseGoogle;
  }

  responseGoogle(res: any) {
    console.log(res.credential);
    alert("yo logged in boi:" + res.credential);
  }

  render() {
    return (<>
      <script src="https://accounts.google.com/gsi/client" async defer></script>
      <script src='global.js'></script>
      <div id="g_id_onload"
        data-client_id="1091354231329-olte7c5ri7n169hhsils52nnm4ps68fm.apps.googleusercontent.com"
        data-callback="responseGoogle"
        data-auto_prompt="false">
      </div>
      <div className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left">
      </div>
    </>
    );
  }
}

/* 
Data:
- group 
- quotes
- current quote
- comments for a quote
- like/unlike
- user-id if logged in
*/

export default LoginTest;
