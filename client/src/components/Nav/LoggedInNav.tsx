import { Button } from "@chakra-ui/react";
import { ButtonWText } from "../Shared/Buttons";


function LoggedInNav(props: { handleSignOut: () => void }) {
  return (
    <>
      <Button variant={'link'} as={'a'} href="/profile">Profile</Button>
      <ButtonWText onClick={props.handleSignOut}>Sign out</ButtonWText>
    </>
  )
}

export default LoggedInNav;