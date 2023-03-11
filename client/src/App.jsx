import { EthProvider } from "./contexts/EthContext";
import useEth from "./contexts/EthContext/useEth";
import Admin from "./components/Admin"
import Footer from "./components/Footer";
import Voter from "./components/Voter";
import NavBar from "./components/NavBar";
import {Box, Container, Divider} from "@mui/material";

function App() {
  const VoteUI = () => {
      const { state } = useEth();
    if (state.web3) {
        if( state.owner === state.accounts[0] ){
            return (
                <Admin/>
            )
        }
        else
        {
            return (
                <Voter/>
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
      <Box>
        <NavBar/>
        <main>
            <Container paddingy={4}>
                <VoteUI />
            </Container>
            <Divider />
            <Container paddingy={4}>
                <Footer />
            </Container>
        </main>
      </Box>
    </EthProvider>
  );
}

export default App;
