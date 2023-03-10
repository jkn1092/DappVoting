import useEth from "../contexts/EthContext/useEth";
import {useEffect, useState} from "react";
import ListVoted from "./ListVoted";

function Admin() {
    const { state } = useEth();
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
                <div>
                    <h4>New voter</h4>
                    <input type="text"
                           value={newVoter}
                           onChange={(e) => setNewVoter(e.target.value)}
                           autoFocus
                    />
                    <button onClick= { () => addVoter() }>
                        Add voter
                    </button>
                </div>
            );
        }
    }

    const ListVoters = () => {
        return votersEvents.map( item => {
            return(
                <li key={item}>{item}</li>
            )
        })
    }

    const ListWorkflowStatusChange = () => {
        if( workflowStatusEvents != null )
        {
            return workflowStatusEvents.map( item => {
                return(
                    <p key={item.previousStatus}>Updated from <i>'{workflowStatusArray[item.previousStatus]}'</i> to <i>'{workflowStatusArray[item.newStatus]}'</i></p>
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
            <h4>Admin: {state.accounts[0]} </h4>
            <br/>
            <div>
                <h4>Current workflow status : {workflowStatusArray[state.workFlowStatus]}</h4>
                <button onClick={ () => nextWorkflowStatus() }>Next Step</button>
            </div>
            <br/>
            <AddVoterUI />

            {votersEvents?.length > 0 ?
                <div>
                    <h4>List voters:</h4>
                    <ul>
                        <ListVoters/>
                    </ul>
                </div>
                :
                <></>
            }

            {workflowStatusEvents?.length > 0 ?
            <div>
                <h4>Workflow status change history</h4>
                <ListWorkflowStatusChange/>
            </div>
                :
                <></>
            }

            <ListVoted/>
        </div>
    );
}

export default Admin;
