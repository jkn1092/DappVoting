import React, { useEffect } from "react";
import {Button, extendTheme, Stack} from '@chakra-ui/react'
import Layout from '../components/Layout'
import Link from "next/link";
import useEth from "../contexts/EthContext/useEth";
import Admin from "./Admin";
import Voter from "./Voter";


const theme = extendTheme({
    styles: {
        global: (props) => ({
            body: {
                bg: 'gray.300'
            }
        })
    }
})

export default function Home() {
    const {state} = useEth();

    const connectWallet = async () => {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
        } catch (err) {
            console.log("error occured while connecting to MetaMask")
        }
    }

    const ConnectedUserUI = () => {
        if( state.owner === state.accounts[0] ){
            return(
                <Admin/>
            )
        }
        else
        {
            return(
                <Voter/>
            )
        }
    }

    return (
        <div>
            <Layout>
                <Stack spacing='6' direction='row' align='center'>
                    {state.accounts ?
                        <ConnectedUserUI/>
                        :
                        <Button colorScheme='blue' size='lg' onClick={() => connectWallet()}>Connect Wallet</Button>
                    }
                </Stack>
            </Layout>
        </div>
    )
}