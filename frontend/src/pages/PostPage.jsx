import { Avatar, Flex, Image, Text, Box, Divider, Button, Spinner } from "@chakra-ui/react"
import Actions from "../components/Actions"
import { useEffect, useState } from "react"
import Comment from "../components/Comment"
import { useNavigate, useParams } from "react-router-dom"
import useShowToast from "../hooks/useShowToast"
import { formatDistanceToNow } from "date-fns"
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { DeleteIcon } from "@chakra-ui/icons"
import { API_BASE_URL } from "../config/api"
import postsAtom from "../atoms/postsAtom"

const PostPage = () => {
  const showToast = useShowToast();

  const [posts, setPosts] = useRecoilState(postsAtom);
  const post = posts[0];

  const {username, pid} = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const currentUser = useRecoilValue(userAtom);
  const user = post?.postedBy;


  useEffect(() => {
    const getPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/posts/${pid}`);
        const data = await res.json();
        if(data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data.post]);
      } catch (error) {
        showToast("Error", error.message, "error");
        return;
      } finally {
        setLoading(false);
      }
    };
    getPost();
  }, [username, setPosts, pid, showToast])


  const handleDelete = async () => {
    if(!window.confirm("Are you sure you want to delete this post?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts/${pid}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if(data.error) {
        showToast("Error", data.error, "error");
      }
      showToast("Success", data.message, "success");
      setPosts([prev => prev.filter(p => p._id !== post._id)]);
      setPosts([]);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  }


  if(!post && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    )
  }

  if(!post) return (
    <Flex justifyContent={"center"} flexDirection={"column"} align={"center"} gap={"5"} >
      <h1>No post found</h1>
      <Button onClick={() => navigate(`/${username}`)}>Go back</Button>
    </Flex>
  );

  return post && (
    <>
      <Flex mb={5}>
        <Flex w='full' alignItems={"center"} gap={3}>
          <Avatar src={post.postedBy.profilePic} size={"md"} name={post.postedBy.name} onClick={() => navigate(`/${post.postedBy.username}`)} cursor={'pointer'} />
          <Flex >
            <Text fontSize={"sm"} fontWeight={"bold"} onClick={() => navigate(`/${post.postedBy.username}`)} cursor={'pointer'} >{post.postedBy.username}</Text>
            <Image src={"/verified.png"} w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"} >
          <Text fontSize={"sm"} color={"gray.light"} textAlign={"right"} w={'36'} >{formatDistanceToNow(new Date(post.createdAt))} ago</Text>
          {currentUser._id === user._id && <DeleteIcon cursor={"pointer"} size={20} onClick={handleDelete} />}
        </Flex>
      </Flex>

      {post.text && <Text my={3}>{post.text}</Text>}

      { post.img && <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
        <Image src={post.img} w={"full"} />
      </Box>}

      <Flex gap={3} my={3}>
        <Actions post={post} />
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"} >
        <Flex gap={2} alignItems={"center"} >
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"} >Get the app to like, reply and post.</Text>
        </Flex>
        <Button>
          Get
        </Button>
      </Flex>

      <Divider my={4} />
      {post.replies && post.replies.map((reply, i) => {
        return (
          <Comment key={i} reply={reply} lastReply={reply._id === post.replies[post.replies.length - 1]._id} />
        )
      })}
      </>
  )
}

export default PostPage
