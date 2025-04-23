import { Flex, Input, InputGroup, InputRightElement, Spinner } from '@chakra-ui/react'
import { useState } from 'react'
import { IoSendSharp } from 'react-icons/io5'
import useShowToast from '../hooks/useShowToast';
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom';
import { useRecoilState, useRecoilValue } from 'recoil';

const MessageInput = ({setMessages}) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [conversations, setConversations] = useRecoilState(conversationsAtom)

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
      try {
        const res = await fetch(`/api/messages/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({message, recipientId : selectedConversation.userId}),
        });

        const data = await res.json();
        if(data.error) {
          return showToast("Error", data.error, "error");
        }
        setMessages(prev => [...prev, data.newMessage]);
        setConversations(prevConvs => {
          const updatedConversations = prevConvs.map(conversation => {
            if(conversation._id === selectedConversation._id) {
              return {
                ...conversation,
                lastMessage: {
                  text: message,
                  sender: data.newMessage.sender
                },
                mock: false
              }
            }
            return conversation;
          })
          return updatedConversations;
        });
        setMessage("");
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
  }

  return (
    <form onSubmit={handleSend} >
        <InputGroup>
            <Input w={"full"} placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)} />
            <InputRightElement cursor="pointer" onClick={handleSend}>
                {loading ? (
                  <Flex>
                  <Spinner size={"xs"} />
                </Flex>
                ) : (
                  <IoSendSharp />
                )}
            </InputRightElement>
        </InputGroup>
    </form>
  )
}

export default MessageInput
