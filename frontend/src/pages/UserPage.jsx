import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import useShowToast from '../hooks/useShowToast'
import { useParams } from "react-router-dom"
import { Flex, Spinner } from "@chakra-ui/react"
import Post from "../components/Post.jsx"
import { Text } from "@chakra-ui/react"
import { useRecoilState, useRecoilValue } from "recoil"
import postsAtom from "../atoms/postsAtom.js"
import CreatePost from '../components/CreatePost.jsx'
import userAtom from "../atoms/userAtom.js"


const UserPage = () => {
  const showToast = useShowToast();

  const currentUser = useRecoilValue(userAtom);

  const [ user, setUser ] = useState(null);
  const [ posts, setPosts ] = useRecoilState(postsAtom);
  const { username } = useParams();

  const [loading, setLoading] = useState(true);

  useEffect( () => {
    const getUser = async  () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if(data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        if(data.user.user.isFrozen) {
          setUser(null);
          return;
        }
        setUser(data.user.user);
        setPosts(data.user.userPosts);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast, setPosts]);

  if(!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    )
  }

  if(!user && !loading) return <h1>User not found</h1>;

  return (
    <>
       {user && 
      <>
        {user && <UserHeader user={user}  /> }
        {!loading && posts?.length === 0 && <Text mt={"16"} textAlign={"center"}>User has no posts.</Text>}
        {loading && (
          <VStack justifyContent={"center"}>
            <Spinner size={"xl"} />
          </VStack>
        )}
        {posts && posts.map((post, i) => {
          return (
            <Post key={i} post={post} />
          )
        })}
        {currentUser._id === user._id && <CreatePost />}
      </>
      }
    </>
  )
}

export default UserPage
