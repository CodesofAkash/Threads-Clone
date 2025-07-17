import { Flex, Box, FormControl, FormLabel, Input, InputGroup, HStack, InputRightElement, Stack, Button, Heading, Text, useColorModeValue, Link } from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import authScreenAtom from '../atoms/authAtom'
import { useSetRecoilState } from 'recoil'
import useShowToast from '../hooks/useShowToast'
import userAtom from '../atoms/userAtom'
import { API_BASE_URL } from '../config/api'

export default function LoginCard() {
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false)
  const setAuthScreenState = useSetRecoilState(authScreenAtom);

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    if(loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs)
      });

      const data = await res.json();
      
      if(data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      localStorage.setItem("user-threads", JSON.stringify(data.user));
      setUser(data.user);
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Flex align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Login
          </Heading>
        </Stack>
        <form onSubmit={handleLogin}>
        <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.dark')} boxShadow={'lg'} p={8} w={{base: "full", sm: "400px"}}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={inputs.email} onChange={(e) => setInputs({...inputs, email: e.target.value})} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} value={inputs.password} onKeyDown={(e) => {
                      if (e.key === 'Enter') handleLogin(e);
                    }} onChange={(e) => setInputs({...inputs, password: e.target.value})} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button size="lg" bg={useColorModeValue("gray.600", "gray.700")} color={'white'} _hover={{ bg: useColorModeValue("gray.700", "gray.800") }} onClick={handleLogin} isLoading={loading} loadingText='Logging in'>
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don't have an account? <Link color={'blue.400'} onClick={() => setAuthScreenState("signup")}>Sign Up</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
        </form>
      </Stack>
    </Flex>
  )
}