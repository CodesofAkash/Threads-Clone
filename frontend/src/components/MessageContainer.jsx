import { Avatar, Box, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import Message from './Message'
import MessageInput from './MessageInput'
import { useEffect, useRef, useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom'
import userAtom from '../atoms/userAtom'
import { useSocket } from '../context/SocketContext'

const MessageContainer = () => {

    const messageRef = useRef();

    const [loading, setLoading] = useState(false);

    const showToast = useShowToast();

    const selectedConversation = useRecoilValue(selectedConversationAtom);    
    const setConversations = useSetRecoilState(conversationsAtom);


    const [messages, setMessages] = useState([]);

    const user = useRecoilValue(userAtom);

    const {socket} = useSocket();

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if(selectedConversation._id === message.conversationId) {
        setMessages(prev => [...prev, message]);
      }
      setConversations(prev => {
        const updatedConversations = prev.map(conversation => {
          if(conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender
              }
            }
          }
          return conversation;
        });
        return updatedConversations;
      });
    });

    return () => socket.off("newMessage");
  }, [socket, selectedConversation._id, setConversations]);

  useEffect(() => {
    const lastMessageIsFromTheOtherUser = messages.length && messages[messages.length-1].sender !== user._id;
    if(lastMessageIsFromTheOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId
      })
    }

    socket.on("messagesSeen", ({conversationId}) => {
      if(selectedConversation._id === conversationId) {
        setMessages(prev => {
          const updatedMessages = prev.map(message => {
            if(!message.seen) {
              return {
                ...message,
                seen: true
              }
            }
            return message
          })
          return updatedMessages
        });
      }
    })
  }, [messages, selectedConversation, socket, user._id])

  useEffect(() => {
        const getMessages = async () => {
          setLoading(true);
          setMessages([]);
          try {
            if(selectedConversation.mock) return;
            const res = await fetch(`/api/messages/${selectedConversation.userId}`);
            const data = await res.json();
            if(data.error) {
              return showToast("Error", data.error, "error");
            }
            setMessages(data.messages);
          } catch (error) {
            showToast("Error", error.message, "error");
          } finally {
            setLoading(false);
          }
        }

        getMessages();
  }, [selectedConversation.userId, selectedConversation.mock, showToast]);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Flex flex={70} p={2} bg={useColorModeValue("gray.200", "gray.dark")} borderRadius={"md"} flexDirection={"column"} >
        <Flex w={"full"} h={12} alignItems={"center"} gap={2} >
            <Avatar src={selectedConversation.profilePic} size={"sm"} />
            <Text display={"flex"} alignItems={"center"} >{selectedConversation.username} <Image src='/verified.png' w={4} h={4} ml={1} /></Text>
        </Flex>

        <Divider />

        <Flex flexDir={"column"} gap={4} my={4} height={"400px"} overflowY={"auto"} p={2} >
            {loading ? (
                [...Array(5)].map((_, i) => (
                    <Flex key={i} gap={2} alignItems={"center"} p={1} borderRadius={"md"} alignSelf={i%2===0? 'flex-start' : 'flex-end'} >
                        {i % 2 === 0 && (
                            <SkeletonCircle size={7} />
                        )}
                        <Flex flexDir={"column"} gap={2}>
                            <Skeleton h={"8px"} w="250px" />
                            <Skeleton h={"8px"} w="250px" />
                            <Skeleton h={"8px"} w="250px" />
                        </Flex>
                        {i%2 !== 0 && (
                            <SkeletonCircle size={7} />
                        )}
                    </Flex>
                ))
            ) : (
            messages.map((message, i) => (
              <Flex key={i} flexDir={"column"} ref={messages.indexOf(message) === messages.length - 1 ? messageRef : null}>
                <Message message={message} ownMessage={message?.sender === user._id} />
              </Flex>
            ))
        )}

        </Flex>

        <MessageInput setMessages={setMessages} />

    </Flex>
  )
}

export default MessageContainer
