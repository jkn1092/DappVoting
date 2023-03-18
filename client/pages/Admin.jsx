import useEth from "../contexts/EthContext/useEth";
import {useEffect, useState} from "react";
import {Box, Container, Divider, Flex, Grid, GridItem, Text, Wrap, WrapItem} from '@chakra-ui/react'
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Heading,
    Input,
    SimpleGrid, Spacer,
    Stack,
    useToast
} from "@chakra-ui/react";
import {workflowStatusArray} from "../components/Utils";
import ListVoted from "../components/ListVoted";


function Admin() {
    const toast = useToast()
    const [newVoter, setNewVoter] = useState("");
    const [votersEvents, setVotersEvents] = useState();
    const [workflowStatusEvents, setWorkflowStatusEvents] = useState();
    const [proposals, setProposals] = useState();

    const {state} = useEth();

    const AddVoterUI = () => {
        const addVoter = async () => {
            if (!state.web3.utils.isAddress(newVoter)) {
                alert("Invalid address")
                return;
            }
            try {
                await state.contract.methods.addVoter(newVoter).send({from: state.accounts[0]});
                setNewVoter("");
                alert("Voter added");
            } catch (err) {
                alert("Invalid address");
            }
        }

        return (
            <Card w={300}>
                <CardHeader>
                    <Heading>Registration</Heading>
                </CardHeader>
                <CardBody>
                    <Input
                        value={newVoter}
                        focusBorderColor='pink.400'
                        placeholder='please add voter name here..'
                        onChange={(e) => setNewVoter(e.target.value)}
                        autoFocus
                    />
                </CardBody>
                <CardFooter>
                    <Button size='lg' onClick={() => addVoter()}>Add voter</Button>
                </CardFooter>
            </Card>
        );
    }

    const ListVoters = () => {
        return (
            <Card w={450}>
                <CardHeader>
                    <Heading>Voter list</Heading>
                </CardHeader>
                <Divider/>
                <CardBody>
                    <ul>{votersEvents ? votersEvents.map(item => {
                        return (<li key={item}>{item}</li>)
                    }) : <li>No Voter is registred</li>
                    }</ul>
                </CardBody>
            </Card>)
    }

    const ListWorkflowStatusChange = () => {
        {
            if (workflowStatusEvents != null) {
                return (
                    <Card w={500}>
                        <CardHeader>
                            <Heading>Workflow history</Heading>
                        </CardHeader>
                        <Divider/>
                        <CardBody>
                            { workflowStatusEvents.length > 0 ?
                                (
                                    <ul>{workflowStatusEvents.map(item => {
                                        return (
                                            <li key={item.previousStatus}>Updated
                                                from <i>{workflowStatusArray[item.previousStatus]}</i> to <i> {workflowStatusArray[item.newStatus]}</i>
                                            </li>
                                        )
                                    })}
                                    </ul>
                                )
                                :
                                <>
                                    No Status Update
                                </>
                            }
                        </CardBody>
                    </Card>
                )
            }
        }
        return;
    }

    const nextWorkflowStatus = async () => {
        const {accounts, contract} = state;
        switch (state.workFlowStatus) {
            case '0' :
                try {
                    await contract.methods.startProposalsRegistering().send({from: accounts[0]});
                    toast({
                        title: 'Congratulations',
                        description: "Started Proposal Registration",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    })
                } catch (err) {
                    toast({
                        title: 'Error',
                        description: "Error when moving to next step",
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                }
                break;
            case '1' :
                try {
                    await contract.methods.endProposalsRegistering().send({from: accounts[0]});
                    toast({
                        title: 'Congratulations',
                        description: "Ended Proposal Registration",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    })
                } catch (err) {
                    toast({
                        title: 'Error',
                        description: "Error when moving to next step",
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                }
                break;
            case '2' :
                try {
                    await contract.methods.startVotingSession().send({from: accounts[0]});
                    toast({
                        title: 'Congratulations',
                        description: "Started Voting Session",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    })
                } catch (err) {
                    toast({
                        title: 'Error',
                        description: "Error when moving to next step",
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                }
                break;
            case '3' :
                try {
                    await contract.methods.endVotingSession().send({from: accounts[0]});
                    toast({
                        title: 'Congratulations',
                        description: "Ended Voting Session",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    })
                } catch (err) {
                    toast({
                        title: 'Error',
                        description: "Error when moving to next step",
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                }
                break;
            case '4' :
                try {
                    await contract.methods.tallyVotes().send({from: accounts[0]});
                    toast({
                        title: 'Congratulations',
                        description: "Tallied Votes",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    })
                } catch (err) {
                    toast({
                        title: 'Error',
                        description: "Error when moving to next step",
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                }
                break;
            default:
        }
    }

    const ListProposals = () => {
        return(
            <Card w={300}>
                <CardHeader>
                    <Heading>Proposals</Heading>
                </CardHeader>
                <Divider/>
                <CardBody>
                    <ul>
                        { proposals?.length > 0 ?
                            proposals.map( item => {
                                let itemText = `Proposal Id '${item.proposalId}' registered`
                                return(<li key={item.proposalId}>{itemText}</li>)
                            })
                            :
                            <li>No proposal yet</li>
                        }
                    </ul>
                </CardBody>
            </Card>
        )
    }

    useEffect(() => {(
        async function () {
            if (state.contract) {
                let oldVoters = await state.contract.getPastEvents('VoterRegistered', {
                    fromBlock: 0,
                    toBlock: 'latest'
                });
                let voters = [];
                oldVoters.forEach(event => {
                    voters.push(event.returnValues.voterAddress);
                });
                setVotersEvents(voters)

                let oldWorkflowStatusChange = await state.contract.getPastEvents('WorkflowStatusChange', {
                    fromBlock: 0,
                    toBlock: 'latest'
                });
                let workflowStatusChange = [];
                oldWorkflowStatusChange.forEach(event => {
                    workflowStatusChange.push(event.returnValues);
                });
                setWorkflowStatusEvents(workflowStatusChange)

                let oldProposalsEvents = await state.contract.getPastEvents('ProposalRegistered', {
                    fromBlock: 0,
                    toBlock: 'latest'
                });
                let proposalEvents=[];
                oldProposalsEvents.forEach(event => {
                    proposalEvents.push({'proposalId': event.returnValues.proposalId});
                });
                setProposals(proposalEvents);
            }
        })();
    }, [state.contract])

    if (!state.web3) {
        return
    } else {
        return (
            <Box>
                { state.workFlowStatus != '5' ?
                    <Button onClick={() => nextWorkflowStatus()}>Next status</Button>
                    :
                    <></>
                }
                    <Wrap>
                        <WrapItem>
                            <ListVoters/>
                        </WrapItem>
                        { state.workFlowStatus === '0' ?
                            (
                                <WrapItem>
                                    <AddVoterUI/>
                                </WrapItem>
                            )
                            :
                            <></>
                        }
                        { state.workFlowStatus > '0' ?
                            (
                                <WrapItem>
                                    <ListProposals/>
                                </WrapItem>
                            )
                            :
                            <></>
                        }
                        { state.workFlowStatus > '2' ?
                            (
                                <WrapItem>
                                    <ListVoted/>
                                </WrapItem>
                            )
                            :
                            <></>
                        }
                        <WrapItem>
                            <ListWorkflowStatusChange/>
                        </WrapItem>
                    </Wrap>
            </Box>
        );
    }
}

export default Admin;
