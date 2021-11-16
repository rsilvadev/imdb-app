import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Loading from './components/Loading';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="*">
          <Loading />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
