import useEth from "../contexts/EthContext/useEth";
import {useEffect, useState} from "react";
import ListVoted from "./ListVoted";
import {Box, Button, Divider, Grid, List, ListItem, ListItemText, TextField, Typography} from "@mui/material";
import {workflowStatusArray} from "./Utils";

const style = {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
};

function Admin() {
    const { state } = useEth();
    const [newVoter, setNewVoter] = useState("");
    const [votersEvents, setVotersEvents] = useState();
    const [workflowStatusEvents, setWorkflowStatusEvents] = useState();

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

        if( state.workFlowStatus === '0' )
        {
            return(
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                        <TextField
                            label="Address of new voter"
                            helperText="0x41..."
                            value={newVoter}
                            onChange={(e) => setNewVoter(e.target.value)}
                            fullWidth
                            autoFocus
                        />
                        </Grid>
                        <Grid item xs={8}>
                        <Button onClick= { () => addVoter() }>
                            Add voter
                        </Button>
                        </Grid>
                    </Grid>
                </Box>
            );
        }
    }

    const ListVoters = () => {
        return votersEvents.map( item => {
            return(
                <ListItem key={item}>
                    <ListItemText primary={item} />
                    <Divider/>
                </ListItem>
            )
        })
    }

    const ListWorkflowStatusChange = () => {
        if( workflowStatusEvents != null )
        {
            return workflowStatusEvents.map( item => {
                return(
                    <ListItem key={item.previousStatus}>
                        <ListItemText key={item.previousStatus}>Updated from <i>'{workflowStatusArray[item.previousStatus]}'</i> to <i>'{workflowStatusArray[item.newStatus]}'</i></ListItemText>
                        <Divider/>
                    </ListItem>
                )
            })
        }
        return;
    }

    const nextWorkflowStatus = async () => {
        const { accounts, contract } = state;
        switch (state.workFlowStatus) {
            case '0' :
                try{
                    await contract.methods.startProposalsRegistering().send({from: accounts[0]});
                    alert("Started Proposal Registration");
                } catch (err) {
                    alert("Error when moving to next step");
                }
                break;
            case '1' :
                try{
                    await contract.methods.endProposalsRegistering().send({from: accounts[0]});
                    alert("Ended Proposal Registration");
                } catch (err) {
                    alert("Error when moving to next step");
                }
                break;
            case '2' :
                try{
                    await contract.methods.startVotingSession().send({from: accounts[0]});
                    alert("Started Voting Session");
                } catch (err) {
                    alert("Error when moving to next step");
                }
                break;
            case '3' :
                try{
                    await contract.methods.endVotingSession().send({from: accounts[0]});
                    alert("Ended Voting Session");
                } catch (err) {
                    alert("Error when moving to next step");
                }
                break;
            case '4' :
                try{
                    await contract.methods.tallyVotes().send({from: accounts[0]});
                    alert("Tallied Votes");
                } catch (err) {
                    alert("Error when moving to next step");
                }
                break;
            default:
        }
    }

    useEffect(() => {
        (async function () {

            let oldVoters= await state.contract.getPastEvents('VoterRegistered', {
                fromBlock: 0,
                toBlock: 'latest'
            });
            let voters=[];
            oldVoters.forEach(event => {
                voters.push(event.returnValues.voterAddress);
            });
            setVotersEvents(voters)

            let oldWorkflowStatusChange = await state.contract.getPastEvents('WorkflowStatusChange', {
                fromBlock: 0,
                toBlock: 'latest'
            });
            let workflowStatusChange=[];
            oldWorkflowStatusChange.forEach(event => {
                workflowStatusChange.push(event.returnValues);
            });
            setWorkflowStatusEvents(workflowStatusChange)

        })();
    }, [state.contract])

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    {state.workFlowStatus < 5 ?
                        <Button onClick={() => nextWorkflowStatus()}>Next Step</Button>
                        :
                        <></>
                    }
                    <AddVoterUI />
                    {votersEvents?.length > 0 ?
                        <div>
                            <h4>List voters:</h4>
                            <List sx={style} component="nav" aria-label="mailbox folders">
                                <ListVoters/>
                            </List>
                        </div>
                        :
                        <></>
                    }
                </Grid>
                <Grid item xs={4}>
                    {workflowStatusEvents?.length > 0 ?
                    <div>
                        <h4>Workflow status change history</h4>
                        <List sx={style} component="nav" aria-label="mailbox folders">
                            <ListWorkflowStatusChange/>
                        </List>
                    </div>
                        :
                        <></>
                    }
                    <ListVoted/>
                </Grid>
            </Grid>
        </div>
    );
}

export default Admin;
