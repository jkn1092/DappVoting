import {Flex, Image, Text, Heading, Spacer} from '@chakra-ui/react';
import Head from "next/head";
import React from "react";

const Header = () => {
    return (

        <Flex justifyContent="space-between" alignItems="left" height="20vh" width="100%" p="2rem" direction={"column"} gap='2'>

            <Heading as='h1' size='2xl'>Online voting</Heading>
            <Spacer />
            <Image
                borderRadius='full'
                boxSize='300px'
                src="vote.png"
                alt='vote'
            />

        </Flex>

    )
}

export default Header;

