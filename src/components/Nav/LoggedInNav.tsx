import { Button } from "@chakra-ui/react";
import { ButtonWText } from "../Shared/Buttons";


function LoggedInNav() {
  return (
    <>
      <Button variant={'link'} as={'a'} href="/profile">Profile</Button>
      <ButtonWText>Sign out</ButtonWText>
    </>
  )
}

export default LoggedInNav;