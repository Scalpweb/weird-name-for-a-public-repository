import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Admin from "./components/Admin";
import Contracts from "./components/Contracts";
import Balances from "./components/Balances";
import Jobs from "./components/Jobs";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./App.css";

const useStyles = makeStyles({
  page: {
    background: "#272D33",
    padding: 10,
    marginTop: 90,
    height: "100vh",
    width: "100vw",
  },
});

function App() {
  const classes = useStyles();
  const [tab, setTab] = useState(0);

  return (
    <div className="App">
      <AppBar position="fixed">
        <Tabs
          value={tab}
          onChange={(_, id) => setTab(id)}
          aria-label="simple tabs example"
        >
          <Tab label="Admin" />
          <Tab label="Contracts" />
          <Tab label="Balances" />
          <Tab label="Jobs" />
        </Tabs>
      </AppBar>
      <div className={classes.page}>
        {tab === 0 && <Admin />}
        {tab === 1 && <Contracts />}
        {tab === 2 && <Balances />}
        {tab === 3 && <Jobs />}
      </div>
    </div>
  );
}

export default App;
