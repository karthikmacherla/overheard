import { Button } from "@chakra-ui/react";
import { useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
import { google_sign_in } from "../fetcher";

function Playground() {
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: tokenResponse => {
      const google_access_token = tokenResponse.access_token;

      google_sign_in(google_access_token)
        .then(res => console.log(res))
        .catch(e => console.log(e))
    },
  })

  return <>
    {/* <Box onClick={() => { }}>
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </Box>; */}
    <Button colorScheme={'blue'} my={5} leftIcon={<FaGoogle />} onClick={() => handleGoogleLogin()}>Sign up with Google</Button>
  </>
}


export default Playground;