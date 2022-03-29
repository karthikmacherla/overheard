import {
  Avatar, Box, Flex, Icon, IconButton,
  Input, InputGroup, Menu, MenuButton, MenuItem, Text,
  MenuList, useColorModeValue, useDisclosure, VStack, FormControl,
} from "@chakra-ui/react";

import { FiSend, FiMoreVertical, FiTrash } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { create_comment, get_comments_for_quotes, get_user_complete } from "../../fetcher";
import { Comment, Quote, User } from '../../models';


import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { useState } from "react";
TimeAgo.addDefaultLocale(en)

// Create formatter (English).
const timeAgo = new TimeAgo('en-US')

// make queries
// fill in data 
// pass necessary info
// cmd + C where possible

function Comments(props: { quote_id: number }) {
  const accessToken = sessionStorage.getItem('access_token') || '';
  const { quote_id } = props;
  const { data: comments } = useQuery(['comments', quote_id, accessToken],
    () => get_comments_for_quotes(quote_id, accessToken),
    {
      retry: (count, err: Error) => err.message !== 'Bad access token',
      enabled: accessToken !== ''
    });

  return <>
    <VStack overflow={'auto'} h={"100%"}>
      {(comments || []).map((item, i) => {
        return < CommentItem key={item.id} commentObj={item} />
      })}
    </VStack>
  </>
}

function CommentBar(props: { quote_id: number }) {
  const accessToken = sessionStorage.getItem('access_token') || '';
  const queryClient = useQueryClient();

  const [comment, setComment] = useState('')

  const handleCommentChange = (e: any) => setComment(e.target.value)

  const addCommentMutation = useMutation(
    (message: string) => create_comment(message, props.quote_id, accessToken),
    {
      onMutate: async (message: string) => {
        await queryClient.cancelQueries('comments');
        const previousQuotes = queryClient.getQueryData<Array<Comment>>(['comments', props.quote_id, accessToken])
        var user = queryClient.getQueryData<User>(['user', accessToken]);
        if (!user) {
          user = { 'email': '', 'name': 'S', id: Math.random() }
        }
        if (previousQuotes) {
          queryClient.setQueryData<Array<Comment>>(['comments', props.quote_id, accessToken],
            [
              ...previousQuotes,
              {
                message: message,
                id: Math.random(),
                likes: 0,
                creator: user,
                quote_id: props.quote_id,
              },
            ]
          )
        }
        return { previousQuotes }
      },
      onError: (err, variables, context) => {
        if (context?.previousQuotes) {
          queryClient.setQueryData<Array<Comment>>(['comments', props.quote_id, accessToken], context.previousQuotes)
        }
      },
      onSettled: (data, err, variables) => {
        queryClient.invalidateQueries(['comments', props.quote_id, accessToken])
      },
    })

  const submit = (e: any) => {
    e.preventDefault();
    addCommentMutation.mutate(comment);
  }
  return <>
    <FormControl>
      <Flex justifyContent={'space-between'}
        width={"100%"}
        alignItems={'center'}
        m={1}>
        <Avatar name={"John"} src='#' m={3} size={'sm'} />
        <InputGroup mt={3} mb={3} >
          <Input variant='unstyled' size={'lg'} type='text' name='comment'
            placeholder='insert comment here' onChange={handleCommentChange} />
        </InputGroup>
        <IconButton type='submit' aria-label={'send'} m={3} icon={<FiSend />} onClick={submit} ></IconButton>
      </Flex>
    </FormControl>
  </>

}

function CommentItem(props: { commentObj: Comment }) {
  let { commentObj } = props;
  let approxDate = timeAgo.format(new Date(commentObj.time || Date.now()));

  return (
    <>
      <Flex justifyContent={'space-between'}
        width={"100%"}
        _hover={{ bg: useColorModeValue('gray.100', 'gray.900') }}
        alignItems={'center'}
        rounded={'md'}>
        <Flex justifyContent={'flex-start'} alignItems={'flex-start'}>
          <Avatar name={commentObj.creator.name} src={commentObj.creator.profile_pic_url || '#'} m={3} size={'sm'} />
          <Box m={2}>
            <Flex justifyContent={'flex-start'} alignItems={'center'}>
              <Text fontSize={'md'} fontWeight={'bold'} mr={1} >{commentObj.creator.name}</Text>
              <Text fontSize={'sm'} fontWeight={'light'}>{approxDate}</Text>
            </Flex>
            <Text fontSize={'md'} fontWeight={'light'} >{commentObj.message}</Text>
          </Box>
        </Flex>
        < CommentMenu />
      </Flex >
    </>)
}


/* Options to manage current member */
const CommentMenu = (props: {}) => {
  // Create modal states
  const deleteState = useDisclosure();
  return (<Menu>
    <MenuButton
      m={1}
      mt={3}
      as={IconButton}
      aria-label='Options'
      icon={<Icon w={5} h={5} as={FiMoreVertical} />}
      variant='link'
    />
    <MenuList>
      <MenuItem icon={<FiTrash />} onClick={deleteState.onOpen}>Remove User</MenuItem>
    </MenuList>
  </Menu>
  )
}

export {
  Comments,
  CommentBar
}