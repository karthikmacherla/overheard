import {
  ChevronDownIcon, CloseIcon, HamburgerIcon
} from '@chakra-ui/icons';
import {
  Box, Collapse, Flex, Icon, IconButton, Link, Stack, Text,
  useBreakpointValue, useColorModeValue, useDisclosure
} from '@chakra-ui/react';
import AddBar from './AddBar';
import LoggedInNav from './LoggedInNav';
import SplashNav from './SplashNav';


interface NavProps {
  addBar?: JSX.Element,
  right?: JSX.Element,
}

function NavBar(props: NavProps) {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Box>
      <Flex
        bg={useColorModeValue('gray.300', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 4 }}
        px={{ base: 4 }}
        align={'center'}>
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>

        <Flex flex={{ base: 0 }} justify={{ base: 'center', md: 'start' }} >
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontSize={'lg'}
            fontFamily={'heading'}
            fontWeight={'bold'}
            color={useColorModeValue('gray.800', 'white')}>
            Over
          </Text>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            fontWeight={'bold'}
            fontSize={'lg'}
            color={useColorModeValue('red.400', 'white')}>
            heard
          </Text>
        </Flex>
        <Flex flex={{ base: 1 }} mx={3} justify={'center'} alignItems={'center'}>
          {props.addBar}
        </Flex>
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          {props.right}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box >
  );
}

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}>
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  // {
  //   label: 'Login',
  //   href: '#',
  // },
  // {
  //   label: 'Signup',
  //   href: '#',
  // },
];

export {
  AddBar, LoggedInNav, NavBar, SplashNav
};
