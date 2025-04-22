import { Flex, Image, useColorMode, Link, Input, Button } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai'
import { RxAvatar } from 'react-icons/rx'
import { FiLogOut, FiSearch } from 'react-icons/fi'
import { useState } from 'react';
import useLogout from '../hooks/useLogout';
import {BsFillChatQuoteFill} from 'react-icons/bs' 

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();

  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/${searchText.trim()}`);
      setSearchText("");
      setShowSearch(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Flex justifyContent={"space-evenly"} mt={6} mb="12" align="center">
      {user && (
        <Link as={RouterLink} to={`/`}>
          <AiFillHome size={24} />
        </Link>
      )}

      <Image
        cursor={"pointer"}
        alt='logo'
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />

      {user && (
        <Flex align={"center"} gap={4}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <RxAvatar size={24} />
          </Link>

          <Link as={RouterLink} to={`/chat`}>
            <BsFillChatQuoteFill size={20} />
          </Link>

          <Button size={"sm"} onClick={logout}>
            <FiLogOut size={20} />
          </Button>

          <FiSearch
            size={20}
            cursor="pointer"
            onClick={() => setShowSearch(prev => !prev)}
          />

          {showSearch && (
            <Input
              placeholder="Search user"
              size="sm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              width="150px"
              autoFocus
              borderRadius={"md"}
            />
          )}
        </Flex>
      )}
    </Flex>
  )
}

export default Header;
