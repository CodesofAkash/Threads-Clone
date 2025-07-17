import { Avatar, Box, Flex, Text, Image, VStack, Spinner } from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import Actions from './Actions'
import { formatDistanceToNow } from 'date-fns'
import { DeleteIcon } from '@chakra-ui/icons'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { useState, memo } from 'react'
import useShowToast from '../hooks/useShowToast'
import postsAtom from '../atoms/postsAtom'
import { API_BASE_URL } from '../config/api'

const Post = memo(({post}) => {
  const navigate =  useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [ , setPosts ] = useRecoilState(postsAtom);
  
  const user = post.postedBy;
 
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    if(!window.confirm("Are you sure you want to delete this post?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts/${post._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if(data.error) {
        showToast("Error", data.error, "error");
      }
      showToast("Success", data.message, "success");
      setPosts(prev => prev.filter(p => p._id !== post._id));
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;
  
  return (
    <Link to={`/${post.postedBy.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5} >
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size={"md"} name={post.postedBy.username} src={post.postedBy.profilePic} onClick={(e) => {e.preventDefault(); navigate(`/${post.postedBy.username}`)}} />
          <Box w="1px" h={"full"} bg={"gray.light"} my={2} ></Box>
          {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
          {post.replies.length === 1 && (
              <Avatar size={"xs"} name={post.replies?.[0]?.username} src={post.replies?.[0]?.profilePic} padding={"2px"} />
            )}
          {post.replies.length === 2 && (
            <Box position={"relative"}>
              <Avatar size={"xs"} name={post.replies?.[0]?.username} src={post.replies?.[0]?.profilePic} pos={"absolute"} bottom={"0px"} right={"-5px"} padding={"2px"} />
              <Avatar size={"xs"} name={post.replies?.[1]?.username} src={post.replies?.[1]?.profilePic} pos={"absolute"} bottom={"0px"} left={"4px"} padding={"2px"} />
            </Box>
          )}
          {post.replies.length > 2 && <Box position={"relative"} w={"full"}>
            <Avatar size={"xs"} name={post.replies?.[0]?.username} src={post.replies?.[0]?.profilePic} pos={"absolute"} top={"0px"} left={"15px"} padding={"2px"} />
            <Avatar size={"xs"} name={post.replies?.[1]?.username} src={post.replies?.[1]?.profilePic} pos={"absolute"} bottom={"0px"} right={"-5px"} padding={"2px"} />
            <Avatar size={"xs"} name={post.replies?.[2]?.username} src={post.replies?.[2]?.profilePic} pos={"absolute"} bottom={"0px"} left={"4px"} padding={"2px"} />
          </Box>}
        </Flex>

      <Flex flex={1} flexDirection={"column"} gap={2} >
        <Flex justifyContent={"space-between"} w={"full"}>
          <Flex w={"full"} alignItems={"center"} >
            <Text fontSize={"sm"} fontWeight={"bold"} onClick={(e) => {e.preventDefault(); navigate(`/${post.postedBy.username}`)}} >{post.postedBy.username}</Text>
            <Image src="/verified.png" w={4} ml={1} />
          </Flex>
          <Flex gap={4} alignItems={"center"} >
            <Text fontSize={"sm"} color={"gray.light"} w={"36"} textAlign={"right"} >{formatDistanceToNow(new Date(post.createdAt))} ago</Text>
            {loading && (
              <VStack alignItems={"center"} >
                <Spinner size={"sm"} />
              </VStack>
            )}
            {currentUser && currentUser._id === user._id && <DeleteIcon cursor={"pointer"} size={20} onClick={(e) => handleDelete(e)} />}
          </Flex>
        </Flex>

        {post.text && <Text fontSize={"sm"} >{post.text}</Text>}

        {post.img && <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
          <Image src={post.img} w={"full"} />
        </Box>}

        <Flex gap={3} my={1} >
          <Actions post={post} />
        </Flex>

      </Flex>
      </Flex>
    </Link>
  )
});

Post.displayName = 'Post';

export default Post;
