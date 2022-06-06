import { Box, Divider } from "@chakra-ui/react"
import { Comments, CommentBar } from "./Comments"



function CommentCard(props: { quoteId: number, prof_name?: string, prof_pic_src?: string }) {
  return (
    <>
      <Box flex={"1 1 auto"} h={'full'} overflow={'scroll'}><Comments quote_id={props.quoteId} /></Box>
      <Box>
        <Divider />
        <CommentBar quote_id={props.quoteId} profile_name={props.prof_name}
          profile_pic_src={props.prof_pic_src} />
      </Box>
    </>
  )
}

export default CommentCard;