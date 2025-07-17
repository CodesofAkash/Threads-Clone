import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import { API_BASE_URL } from "../config/api";
import userAtom from "../atoms/userAtom";

const HomePage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
	const user = useRecoilValue(userAtom);
	const showToast = useShowToast();
	
	useEffect(() => {
		const getFeedPosts = async () => {
			if (!user) {
				setLoading(false);
				return;
			}
			
			setLoading(true);
			setPosts([]);
			try {
				const res = await fetch(`${API_BASE_URL}/api/posts/feed`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				});
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setPosts(data.feedPosts || []);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast, setPosts, user]);

	return (
		<Flex gap='10' alignItems={"flex-start"}>
			<Box flex={70}>
				{!loading && posts?.length === 0 && <h1>Follow some users to see the feed</h1>}

				{loading && (
					<Flex justify='center'>
						<Spinner size='xl' />
					</Flex>
				)}

				{posts && posts.map((post) => (
					<Post key={post._id} post={post} />
				))}
			</Box>
			<Box flex={30} 
			display={{
				base: "none",
				md: "block"
			}}
			>
				<SuggestedUsers />
			</Box>
		</Flex>
	);
};

export default HomePage;