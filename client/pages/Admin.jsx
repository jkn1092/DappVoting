import useEth from "../contexts/EthContext/useEth";
import {useEffect, useReducer, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Heading,
    Input,
    useToast,
    SimpleGrid,
    GridItem,
    Grid
} from '@chakra-ui/react'
import {workflowStatusArray} from "../components/Utils";
import ListVoted from "../components/ListVoted";
import {actions, reducer} from "../contexts/EthContext";

function Admin() {
    const toast = useToast()
    const [newVoter, setNewVoter] = useState("");
    const [votersEvents, setVotersEvents] = useState();
    const [workflowStatusEvents, setWorkflowStatusEvents] = useState();
    const [proposals, setProposals] = useState();

    const {state} = useEth();

    const [, dispatch] = useReducer(reducer, state);

    const AddVoterUI = () => {
        const addVoter = async () => {
            if (!state.web3.utils.isAddress(newVoter)) {
                alert("Invalid address")
                return;
            }
            try {
                await state.contract.methods.addVoter(newVoter).send({from: state.accounts[0]});
                let voters = [];
                voters.push(votersEvents);
                voters.push(newVoter);
                setVotersEvents(voters);
                setNewVoter("");
                toast({
                    title: 'Congratulations',
                    description: "Voter added",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
            } catch (err) {
                toast({
                    title: 'Error',
                    description: "An error was occurred" + err,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            }
        }

        return (
            <Card w={500}>
                <CardHeader>
                    <Heading color={"gray.600"}>Registration</Heading>
                </CardHeader>
                <CardBody>
                    <Input
                        value={newVoter}
                        focusBorderColor='pink.400'
                        placeholder='Please add voter address here..'
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
            <Card w={500}>
                <CardHeader>
                    <Heading color={"gray.600"}>Voter List</Heading>
                </CardHeader>
                <Divider/>
                <CardBody>
                    <ul>{votersEvents?.length ? votersEvents.map(item => {
                        return (<li key={item}>{item}</li>)
                    }) : <>No Voter is registred</>
                    }</ul>
                </CardBody>
            </Card>)
    }

    const ListWorkflowStatusChange = () => {
        {
            if (workflowStatusEvents != null) {
                return (
                    <Card w={500}>
                        <CardHeader color={"gray.600"}>
                            <Heading>Workflow status history</Heading>
                        </CardHeader>
                        <Divider/>
                        <CardBody>
                            {workflowStatusEvents.length > 0 ?
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
                    dispatch({
                        type: actions.update,
                        data: { workFlowStatus : 1 }
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
                    dispatch({
                        type: actions.update,
                        data: { workFlowStatus : 2 }
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
                    dispatch({
                        type: actions.update,
                        data: { workFlowStatus : 3 }
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
                    dispatch({
                        type: actions.update,
                        data: { workFlowStatus : 4 }
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
                    dispatch({
                        type: actions.update,
                        data: { workFlowStatus : 5 }
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
        return (
            <Card w={500}>
                <CardHeader>
                    <Heading color={"gray.600"}>Proposals</Heading>
                </CardHeader>
                <Divider/>
                <CardBody>
                    <ul>
                        {proposals?.length > 0 ?
                            proposals.map(item => {
                                let itemText = `Proposal Id '${item.proposalId}' registered`
                                return (<li key={item.proposalId}>{itemText}</li>)
                            })
                            :
                            <li>No proposal yet</li>
                        }
                    </ul>
                </CardBody>
            </Card>
        )
    }

    useEffect(() => {
        (
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
                    let proposalEvents = [];
                    oldProposalsEvents.forEach(event => {
                        proposalEvents.push({'proposalId': event.returnValues.proposalId});
                    });
                    setProposals(proposalEvents);
                }
            })();
    }, [state.contract])

    function getButtonName() {
        switch (state.workFlowStatus){
            case '0' : return 'Start Proposals registration'
            case '1' : return 'End Proposals registration'
            case '2' : return 'Start Voting session'
            case '3' : return 'End Voting session'
            case '4' : return 'Tally votes'
        }
    }

    if (!state.web3) {
        return
    } else {
        return (
            <div>

                <Box justifyItems={"center"}> <Button hidden={state.workFlowStatus === '5'}
                                                      onClick={() => nextWorkflowStatus()}>{getButtonName()}</Button>
                </Box>
                <br/>
                <br/>
                <Grid templateRows='repeat(3, 1fr)'
                      templateColumns='repeat(2, 1fr)'
                      gap={6}
                     >
                    <GridItem w='100%' rowSpan={3} colSpan={1}>
                        <ListWorkflowStatusChange/>
                    </GridItem>
                    <GridItem w='100%' h='100%' hidden={state.workFlowStatus !== '0'}>
                        <AddVoterUI/>
                    </GridItem>
                    <GridItem w='100%' h='100%' hidden={state.votersEvents}>
                        <ListVoters/>
                    </GridItem>
                    <GridItem w='100%' h='100%' hidden={state.workFlowStatus === '0'}>
                        <ListProposals/>
                    </GridItem>
                    <GridItem w='100%' h='100%' hidden={state.workFlowStatus <= '2'}>
                        <ListVoted/>
                    </GridItem>


                </Grid>
            </div>
        )
            ;
    }
}

export default Admin;
