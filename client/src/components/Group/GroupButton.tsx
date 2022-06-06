import { Icon, StarIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, IconButton, MenuList, MenuItem, MenuGroup } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Group } from "../../models";


function GroupButton(props: {
  groups: Array<Group>,
  id: number,
  setId: React.Dispatch<React.SetStateAction<number>>
}) {

  console.log("Group Button");
  console.log(props.groups);
  return (<Menu>
    <MenuButton
      as={IconButton}
      aria-label='Options'
      icon={<Icon as={BsThreeDotsVertical} />}
      variant='solid'
      rounded={'full'}
      bg={'red.400'}
      _hover={{ bg: 'red.300' }}
      _active={{ bg: 'red.300' }}
      color={'white'}
    />
    <MenuList>
      <MenuGroup title='Groups'>
        {props.groups.map((item, idx) =>
          <MenuItem
            icon={item.id === props.id ? <StarIcon /> : <></>}
            onClick={() => props.setId(item.id)}>
            {item.group_name}
          </MenuItem>
        )}
      </MenuGroup>
    </MenuList>
  </Menu>)
}
export default GroupButton;