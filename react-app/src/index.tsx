import React from 'react';
import ReactDOM from 'react-dom';
import { ResetPasswordForm } from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { LoginForm } from './forms/LoginForm';
import { RegisterForm } from './forms/register/RegisterForm';
import BalanceProxy from './balance/BalanceProxy';
import MasterPage from './MasterPage';
import { CurrencyConverter } from './currency-converter/CurrencyConverter';
import ExchangeRatesForm from './exchange-rates/ExchangeRatesForm';
import LoanCalculator from './loan-calculator/LoanCalculator';
import InterestCalculator from './interest-calculator/InterestCalculator';
import { CurrencyInflation } from './currency-inflation/CurrencyInflation';
import MainForm from './MainForm';

ReactDOM.render(
  <React.StrictMode>
    {getRouter()}
  </React.StrictMode>,
  document.getElementById('root')
);

function getRouter() {

  let pages = new Map<string, React.ComponentType<any>>([
    ['login', LoginForm],
    ['register', RegisterForm],
    ['reset-password', ResetPasswordForm],
    ['balance', BalanceProxy],
    ['currency-converter', CurrencyConverter],
    ['exchange-rates', ExchangeRatesForm],
    ['loan-calculator', LoanCalculator],
    ['interest-calculator', InterestCalculator],
    ['currency-inflation', CurrencyInflation]
  ]);

  let redirects = new Array<JSX.Element>();
  pages.forEach((value, key) => redirects.push(<Redirect key={key} from={'/' + key} to={'/en/' + key} />));

  let routes = new Array<JSX.Element>();
  pages.forEach((value, key) => routes.push(<Route key={key} exact path={getPaths(key)} component={value} />));

  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact from='/' to='/en' />
        {redirects}
        <MasterPage>
          <Route key='' exact path={getPaths('')} component={MainForm} />
          {routes}
        </MasterPage>
      </Switch>
    </BrowserRouter>
  );
}

function getPaths(path: string) {
  let languages = ['en', 'es', 'ru'];
  return languages.map(l => (l === '' ? '' : '/' + l) + (path === '' ? '' : ('/' + path)));
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
