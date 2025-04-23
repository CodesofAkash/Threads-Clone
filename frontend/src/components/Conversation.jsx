import { Avatar, AvatarBadge, Flex, Image, Stack, Text, useColorMode, useColorModeValue, WrapItem } from '@chakra-ui/react'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import  { BsCheck2All } from 'react-icons/bs'
import { selectedConversationAtom } from '../atoms/messagesAtom';

const Conversation = ({conversation}) => {
  const user = useRecoilValue(userAtom);

  const colorMode = useColorMode();

  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);    

  const otherUser = conversation.participants[0];

  return (
    <Flex 
    onClick={() => setSelectedConversation({
      _id: conversation._id,
      userId: otherUser._id,
      username: otherUser.username,
      profilePic: otherUser.profilePic,
      mock: conversation.mock
    })}
    gap={4} alignItems={"center"} p={1}
    _hover={{
        cursor: "pointer", bg: useColorModeValue("gray.600", 'gray.dark'), color: "white"
    }}
    borderRadius={"md"}
    bg={selectedConversation?._id === conversation._id ? (colorMode === "light" ? "gray.400" : "gray.dark") : ""}
    >
      <WrapItem>
        <Avatar size={{
            base: "xs", sm: "sm", md: "md"
        }} src={otherUser?.profilePic}>
          <AvatarBadge boxSize={"1em"} bg={"green.500"} />
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"} >
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
            {otherUser?.username} <Image src='/verified.png' w={4} h={4} ml={1} />
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {user._id === conversation.lastMessage.sender ? <BsCheck2All /> : ""}
            {conversation?.lastMessage.text.length > 18 ? conversation?.lastMessage.text.substring(0, 18) + "..." : conversation?.lastMessage.text}
        </Text>
      </Stack>
    </Flex>
  )
}

export default Conversation
