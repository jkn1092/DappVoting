import useEth from "../contexts/EthContext/useEth";
import {useEffect, useState} from "react";

function Admin() {
    const { state } = useEth();
    const [notification, setNotification] = useState("");
    const [newVoter, setNewVoter] = useState("");
    const [votersEvents, setVotersEvents] = useState();

    const AddVoterUI = () => {

        const addVoter = async () => {
            try {
                await state.contract.methods.addVoter(newVoter).send({from: state.accounts[0]});

                setNotification("Voter ajouté");
                setNewVoter("");
            } catch (err) {
                setNotification("Non valide");
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
        if( votersEvents != null )
        {
            return votersEvents.map( item => {
                return(
                    <li key={item}>{item}</li>
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
                    setNotification("Started Proposal Registration");
                } catch (err) {
                    setNotification("Error when moving to next step");
                }
                break;
            case '1' :
                try{
                    await contract.methods.endProposalsRegistering().send({from: accounts[0]});
                    setNotification("Ended Proposal Registration");
                } catch (err) {
                    setNotification("Error when moving to next step");
                }
                break;
            case '2' :
                try{
                    await contract.methods.startVotingSession().send({from: accounts[0]});
                    setNotification("Started Voting Session");
                } catch (err) {
                    setNotification("Error when moving to next step");
                }
                break;
            case '3' :
                try{
                    await contract.methods.endVotingSession().send({from: accounts[0]});
                    setNotification("Ended Voting Session");
                } catch (err) {
                    setNotification("Error when moving to next step");
                }
                break;
            case '4' :
                try{
                    await contract.methods.tallyVotes().send({from: accounts[0]});
                    setNotification("Tallied Votes");
                } catch (err) {
                    setNotification("Error when moving to next step");
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
        })();
    }, [state.contract])

    return (
        <div>
            <h2>Admin</h2>
            <div>
                <p>{notification}</p>
            </div>
            <div>
                <h4>Workflow Status {state.workFlowStatus}</h4>
                <button onClick={ () => nextWorkflowStatus() }>Next Step</button>
            </div>
            <br/>
            <AddVoterUI />
            <br/>
            <div>
                <h4>List voters:</h4>
                <ul>
                    <ListVoters/>
                </ul>
            </div>
        </div>
    );
}

export default Admin;
