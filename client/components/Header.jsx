import {Flex, Image, Text, Heading, Spacer} from '@chakra-ui/react';
import Head from "next/head";
import React from "react";
import Admin from "../pages/Admin";
import Voter from "../pages/Voter";
import useEth from "../contexts/EthContext/useEth";

const Header = () => {
    const {state} = useEth();

    const UserStatusUI = () => {
        if( state.accounts )
        {
            if( state.owner === state.accounts[0] ){
                return(
                    <>Admin : {state.accounts[0]}</>
                )
            }
            else
            {
                return(
                    <>Voter : {state.accounts[0]}</>
                )
            }
        }
    }

    return (

        <Flex justifyContent="space-between" alignItems="left" height="20vh" width="100%" p="2rem" direction={"column"} gap='2'>
            <Heading as='h1' size='2xl'>Online voting</Heading>
            <Flex width="30%" justifyContent="space-between" alignItems="center">
                <UserStatusUI/>
            </Flex>
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

