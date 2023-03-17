import React, { useEffect } from "react";
import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    extendTheme,
    Stack, Tab,
    TabList, TabPanel,
    TabPanels,
    Tabs
} from '@chakra-ui/react'
import Layout from '../components/Layout'
import useEth from "../contexts/EthContext/useEth";
import Admin from "./Admin";
import Voter from "./Voter";
import {workflowStatusArray} from "../components/Utils";


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

    const WorkflowStatusDisplay = () => {
        return(
            <Breadcrumb spacing='8px' separator={'>'}>
                {
                    workflowStatusArray.map( item => {
                        return(
                            <BreadcrumbItem key={item}>
                                {
                                    workflowStatusArray[state.workFlowStatus] === item ?
                                        <BreadcrumbLink color={"blue.400"}>{item}</BreadcrumbLink>
                                        :
                                        <BreadcrumbLink>{item}</BreadcrumbLink>
                                }
                            </BreadcrumbItem>
                        );
                    })
                }
            </Breadcrumb>
        );
    }

    const ConnectedUserUI = () => {

        return (
            <>
                <WorkflowStatusDisplay/>
                { state.workFlowStatus === '5' ?
                    (
                        <Box bg='blue.400' w='100%' p={4} color='white'>
                            Winning Proposal ID : { state.winningProposalId }
                        </Box>
                    )
                    :
                        <></>
                }
                <Tabs>
                    <TabList>
                        <Tab>Voter</Tab>
                        { state.owner === state.accounts[0] ? (<Tab> Admin </Tab>) : <></> }
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Voter/>
                        </TabPanel>
                        { state.owner === state.accounts[0] ? (<TabPanel> <Admin/> </TabPanel>) : <></> }
                    </TabPanels>
                </Tabs>
            </>
        )
    }

    return (
        <div>
            <Layout>
                    {state.accounts ?
                        <ConnectedUserUI/>
                        :
                        <Button colorScheme='blue' size='lg' onClick={() => connectWallet()}>Connect Wallet</Button>
                    }
            </Layout>
        </div>
    )
}