import useEth from "../contexts/EthContext/useEth";
import {useEffect, useState} from "react";
import {Divider, Grid, GridItem, Text} from '@chakra-ui/react'
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


function Admin() {
    const toast = useToast()
    const [newVoter, setNewVoter] = useState("");
    const [votersEvents, setVotersEvents] = useState();
    const [workflowStatusEvents, setWorkflowStatusEvents] = useState();

    const workflowStatusArray = [
        'Registering Voters',
        'Proposals Registration Started',
        'Proposals Registration Ended',
        'Voting Session Started',
        'Voting Session Ended',
        'Votes Tallied'
    ]

    const {state} = useEth();

    const AddVoterUI = () => {

        const addVoter = async () => {
            console.log(newVoter);
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

        if (state.workFlowStatus === '0') {
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
        } else {
            return (
                <Card w={300}>
                    <CardHeader>
                        <Heading>Registration</Heading>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                        <Text>No voter can be registred after closing registration session</Text>
                    </CardBody>
                </Card>
            );
        }
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
                            <Heading>Update status history</Heading>
                        </CardHeader>
                        <Divider/>
                        <CardBody>
                            { workflowStatusEvents.lenght > 0 ?
                                (
                                    <ul>{workflowStatusEvents.map(item => {
                                        return (
                                            <li key={item.previousStatus}>Updated
                                                from <i>{workflowStatusArray[item.previousStatus]}</i> to <i> {workflowStatusArray[item.newStatus]}</i>
                                            </li>
                                        )
                                    })},
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
            }
        })();
    }, [state.contract])

    if (!state.web3) {
        return
    } else {
        return (
            <div align={'center'}>
                <Heading>Admin dashboard</Heading>
                <br/><br/>
                <Grid templateColumns='repeat(4, 1fr)' gap={2}>
                    <GridItem w='100%' h='10'>
                        <ListVoters/>
                    </GridItem>
                    <GridItem w='100%' h='10'>
                        <AddVoterUI/>
                    </GridItem>
                    <GridItem w='100%' h='10'>
                        <Card w={300}>
                            <CardHeader>
                                <Heading>Status</Heading>
                            </CardHeader>
                            <Divider/>
                            <CardBody>
                                <Text>The current workflow status is : </Text>
                                <Text as='u'>{workflowStatusArray[state.workFlowStatus]}</Text>
                            </CardBody>
                            <CardFooter>
                                <Button onClick={() => nextWorkflowStatus()}>Next status</Button>
                            </CardFooter>
                        </Card>
                    </GridItem>
                    <GridItem w='100%' h='10'>
                        <ListWorkflowStatusChange/>
                    </GridItem>
                </Grid>
            </div>
        );
    }
}

export default Admin;
