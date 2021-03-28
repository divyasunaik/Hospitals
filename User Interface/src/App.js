import { Container } from "react-bootstrap";
import { BrowserRouter, Route } from "react-router-dom";
import HomePage from "./components/homepage";
import Hospitals from "./components/hospitals";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <main className="py-3">
        <Container>
          <Route path="/" component={HomePage} exact />
          <Route path="/hospitals" component={Hospitals} />
        </Container>
      </main>
    </BrowserRouter>
  );
}

export default App;
