import { EthProvider } from "./contexts/EthContext";
import useEth from "./contexts/EthContext/useEth";
import Admin from "./components/Admin"
import Footer from "./components/Footer";
import Voter from "./components/Voter";

function App() {
  const VoteUI = () => {
      const { state } = useEth();
    if (state.web3) {
        if( state.owner === state.accounts[0] ){
            return (
                <>
                    <Admin/>
                </>
            )
        }
        else
        {
            return (
                <>
                    <Voter/>
                </>
            )
        }
    }
    else{
      return (
          <>
          </>
      )
    }
  }

  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <VoteUI />
          <hr />
          <Footer />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
