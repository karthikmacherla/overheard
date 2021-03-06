import LoginButton from '../Auth/Login';
import SignupButton from '../Auth/Signup';

function SplashNav(props: { handleSignIn: (access_token: string) => void }) {
  return (
    <>
      <LoginButton handleSignIn={props.handleSignIn} />
      <SignupButton handleSignIn={props.handleSignIn} />
    </>
  )
}

export default SplashNav;