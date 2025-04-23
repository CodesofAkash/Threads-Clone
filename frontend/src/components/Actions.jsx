import { Box, Button, Flex, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure } from "@chakra-ui/react"
import { useRef, useState, useCallback } from "react"
import {useRecoilState, useRecoilValue} from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast.js'
import postsAtom from '../atoms/postsAtom.js'

const Actions = ({ post }) => {
	const user = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [posts, setPosts] = useRecoilState(postsAtom);
	const [liked, setLiked] = useState(post.likes.includes(user?._id));

	const [loading, setLoading] = useState();

	const handleLike =  async (e) => {
		e.preventDefault();
		if(!user) {
			showToast("Error", "You must be logged in to like a post", "error");
			return;
		}
		if(loading) return;
		setLoading(true);
		try {
			const res = await fetch(`/api/posts/like/${post?._id}`);
			const data = await res.json();
			if(data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			if(!liked) {
				const updatedPosts = posts.map((p) => {
					if(p._id === post._id) {
						return { ...p, likes: [...p.likes, user._id]};
					}
					return p;
				});
			setPosts(updatedPosts);
			} else  {
				const updatedPosts = posts.map((p) => {
					if(p._id === post._id) {
						return {...p, likes: p.likes.filter((id) => id!== user._id)};
					}
					return p;
				})
			setPosts(updatedPosts);
			}
			setLiked(!liked);
			showToast("Success", data.message, "success")
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setLoading(false);
		}
	}


	const [reply, setReply] = useState("");
	const [replyLoading, setReplyLoading] = useState(false);
	const initialRef = useRef();

	const handleReply = useCallback ( async (e) => {
		setReplyLoading(true);
		e?.preventDefault();
		try {
			const res = await fetch(`/api/posts/reply/${post._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({message: reply})
			});
			const data = await res.json();
			if(data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			const updatedPosts = posts.map(p => {
				if(p._id === post._id) {
					return {...p, replies: [data, ...p.replies]};
				}
				return p;
			})
			setPosts(updatedPosts);
			showToast("Success", data.message, "success");
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setReplyLoading(false);
			setReply("");
			onClose();
		}
	}, [onClose, reply, post, posts, setPosts, showToast])

  return (
	<Flex flexDirection="column">
		{(loading || replyLoading) && (
			<Flex>
				<Spinner size={"xs"} />
			</Flex>
		)}
		<Flex gap={3} my={2} onClick={(e) => e.preventDefault()} >
			<svg
				aria-label="like"
				color={liked? "rgb(237, 73, 86)": ""}
				fill={liked? "rgb(237, 73, 86)": "transparent"}
				height="19"
				role="img"
				viewBox="0 0 24 22"
				width='20'
				onClick={(e) => handleLike(e)}
			>
				<path
					d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66c0-3.736-3.755-6.672-8.328-6.672-1.4 0-2.738.408-3.766 1-1.028-.592-2.366-1-3.766-1C4.755 1 1 3.924 1 7.66Z"
					stroke="currentColor"
					strokeWidth="2"
				/>
			</svg>

			<svg
				aria-label='Comment'
				color=''
				fill=''
				height='20'
				role='img'
				viewBox='0 0 24 24'
				width='20'
				onClick={onOpen}
			>
				<title>Comment</title>
				<path
					d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
					fill='none'
					stroke='currentColor'
					strokeLinejoin='round'
					strokeWidth='2'
				></path>
			</svg>

			<RepostSVG />
			<ShareSVG/>

		</Flex>

		<Flex gap={2} alignItems={"center"} >
			<Text color={"gray.light"} fontSize={"sm"} >{ post?.likes?.length || 0 } likes</Text>
			<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"} ></Box>
			<Text color={"gray.light"} fontSize={"sm"} >{ post?.replies?.length || 0 } replies</Text>
		</Flex>

		<Modal
        isOpen={isOpen}
        onClose={onClose}
		initialFocusRef={initialRef}
        >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>What do you think</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input ref={initialRef} placeholder='Comment your thoughts' value={reply} onKeyDown={(e) => e.key === 'Enter' && handleReply(e)} onChange={(e) => setReply(e.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button isLoading={replyLoading} colorScheme='blue' mr={3} size={"sm"} onClick={handleReply}>
              Reply
            </Button>
            <Button onClick={onClose} size={"sm"} >Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

	</Flex>
  )
}

export default Actions


const RepostSVG = () => {
	return (
		<svg
		aria-label='Repost'
		color='currentColor'
		fill='currentColor'
		height='20'
		role='img'
		viewBox='0 0 24 24'
		width='20'
	>
		<title>Repost</title>
		<path
			fill=''
			d='M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z'
		></path>
	</svg>
	)
}

const ShareSVG = () => {
	return (
		<svg
		aria-label='Share'
		color=''
		fill='rgb(243, 245, 247)'
		height='20'
		role='img'
		viewBox='0 0 24 24'
		width='20'
	>
		<title>Share</title>
		<line
			fill='none'
			stroke='currentColor'
			strokeLinejoin='round'
			strokeWidth='2'
			x1='22'
			x2='9.218'
			y1='3'
			y2='10.083'
		></line>
		<polygon
			fill='none'
			points='11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334'
			stroke='currentColor'
			strokeLinejoin='round'
			strokeWidth='2'
		></polygon>
	</svg>
	)
}