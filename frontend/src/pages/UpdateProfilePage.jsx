import { Button, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue, HStack, Avatar, AvatarBadge, IconButton, Center, Textarea } from '@chakra-ui/react'
import { useState, useRef } from 'react'
import { useRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom';
import usePreviewImg from '../hooks/usePreviewImg';
import useShowToast from '../hooks/useShowToast';
import { Link } from 'react-router-dom'
import { BsUpload } from 'react-icons/bs';
import { API_BASE_URL } from '../config/api';

export default function UpdateProfilePage() {
  const showToast = useShowToast();
  const {handleImgChange, imgUrl} = usePreviewImg();

  const [user, setUser] = useRecoilState(userAtom);

  const [updating, setUpdating] = useState(false);

  const fileRef = useRef(null);

  const [inputs, setInputs] = useState({
      name: user.name,
      username: user.username,
      email: user.email,
      password: "",
      bio: user.bio,
      profilePic: user.profilePic
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/update`, {
        method: "PUT",
        headers: {
          'Content-Type': "application/json",
        },
        credentials: "include",
        body: JSON.stringify({...inputs, profilePic: imgUrl }),
        })
        const data = await res.json();
        if(data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        showToast("Success", "Profile updated successfully", "success");
        setUser(data.user);
        localStorage.setItem('user-threads', JSON.stringify(data.user));
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
    <Flex
      align={'center'}
      justify={'center'}
      
      >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.dark')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        mb={12}
        >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Profile Edit
        </Heading>
        <FormControl>
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" boxShadow={"md"} src={imgUrl || inputs.profilePic} />
            </Center>
            <Center w="full">
              <Button w="full" onClick={() => fileRef.current.click()} >Change Avatar</Button>
              <Input type='file' hidden ref={fileRef} onChange={handleImgChange}/>
            </Center>
          </Stack>
        </FormControl>
        <FormControl>
          <FormLabel>Full name</FormLabel>
          <Input
            placeholder="FullName"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            onChange={(e) => setInputs({...inputs, name: e.target.value})}
            value={inputs.name}
          />
        </FormControl>
        <FormControl>
          <FormLabel>User name</FormLabel>
          <Input
            placeholder="UserName"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            onChange={(e) => setInputs({...inputs, username: e.target.value})}
            value={inputs.username}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            onChange={(e) => setInputs({...inputs, email: e.target.value})}
            value={inputs.email}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="password"
            _placeholder={{ color: 'gray.500' }}
            type="password"
            onChange={(e) => setInputs({...inputs, password: e.target.value})}
            value={inputs.password}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Bio</FormLabel>
          <Textarea
            placeholder="bio"
            _placeholder={{ color: 'gray.500' }}
            onChange={(e) => setInputs({...inputs, bio: e.target.value})}
            value={inputs.bio}
          />
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Link to="/" style={{width: "100%"}}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}>
            Cancel
          </Button>
          </Link>
          <Button
            bg={'green.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'green.500',
            }}
            type="submit"
            isLoading={updating}
            >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
    </form>
  )
}