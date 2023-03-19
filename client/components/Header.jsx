import {Box, Button, Flex, Heading, Image, Stack} from '@chakra-ui/react';
import React from "react";
import useEth from "../contexts/EthContext/useEth";

const Header = () => {
    const {state} = useEth();

    const UserStatusUI = () => {
        if (state.accounts) {
            return (
                <Stack
                    flex={{base: 1, md: 0}}
                    justify={'flex-end'}
                    direction={'row'}
                    spacing={6}>
                    <Button
                        alignSelf={"right"}
                        px={4}
                        fontSize={'sm'}
                        rounded={'full'}
                        bg={'blue.400'}
                        color={'white'}
                        boxShadow={
                            '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                        }
                        _hover={{
                            bg: 'blue.500',
                        }}
                        _focus={{
                            bg: 'blue.500',
                        }}>
                        {state.accounts[0].slice(0, 5)}...{state.accounts[0].slice(state.accounts[0].length - 5)}
                    </Button>
                </Stack>
            );
        }
    }

    return (
        <div>
            <Flex justifyContent={'space-between'} minH={'60px'}
                  py={{base: 2}}
                  px={{base: 4}}
                  align={'center'}
            >
                <Image
                    borderRadius='full'
                    boxSize='100px'
                    src="vote.png"
                    alt='vote'
                />
                <Heading as='h1' size='xl'>Online voting</Heading>
                <UserStatusUI/>
            </Flex>
        </div>

    )
}

export default Header;

