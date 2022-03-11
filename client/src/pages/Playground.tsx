import LoginButton from "../components/Auth/Login";
import { User } from "../models";

function playground() {
  function handleSignIn(u: User, access_token: string) {
    console.log(JSON.stringify(u));
    console.log(access_token);
  }


  return <>
    <LoginButton handleSignIn={handleSignIn} />
  </>
}


export default playground;