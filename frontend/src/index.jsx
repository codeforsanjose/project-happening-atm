import React, { Suspense, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useMutation,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import './index.scss';

import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import MeetingListView from './components/MeetingListView/MeetingListView';
import AgendaTable from './components/AgendaTable/AgendaTable';
import MeetingView from './components/MeetingView/MeetingView';
import Subscribe from './components/Subscribe/Subscribe';
import AdminView from './components/AdminView/AdminView';
import EmailConfirmPage from './components/EmailConfirmPage/EmailConfirmPage';
import Footer from './components/Footer/Footer';

import * as serviceWorker from './serviceWorker';

import { GET_ALL_MEETINGS_WITH_ITEMS, CREATE_SUBSCRIPTIONS } from './graphql/graphql';
import AdminPaths from './constants/AdminPaths';
import LoginHandler from './components/LoginHandler/LoginHandler';
import AuthRoute from './components/AuthRoute/AuthRoute';
import './i18n';

<<<<<<< HEAD
const httpLink = createHttpLink({
  uri: `http://${process.env.REACT_APP_GRAPHQL_URL}/graphql`,
});

// this will decode a token into a usable json object
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

//
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  const tokenObj = parseJwt(token);

  // get the seconds since epoch
  const seconds = new Date() / 1000;

  // return the headers to the context so httpLink can read them
  // token must have correct issuer, and not be expired

  return {
    headers: {
      ...headers,
      authorization: tokenObj.iss === 'ADD-ISSUER-DOMAIN' && tokenObj.exp > seconds ? `Bearer ${token}` : '',
    },
  };
});
console.log(authLink);
console.log(localStorage.getItem('token'));
const client = new ApolloClient({
  link: authLink.concat(httpLink),
=======
const client = new ApolloClient({
  uri: `${process.env.REACT_APP_GRAPHQL_URL}/graphql`,
>>>>>>> develop
  cache: new InMemoryCache(),
});

function SampleQuery() {
  const { loading, error, data } = useQuery(GET_ALL_MEETINGS_WITH_ITEMS);

  // eslint-disable-next-line no-console
  if (loading) console.log('THE Loading: ', loading);
  // eslint-disable-next-line no-console
  if (error) console.log('THE Error: ', error);

  // eslint-disable-next-line no-console
  console.log(data);

  return null;
}

function SubscriptionPage() {
  const [createSubscriptions, { loading, error, data }] = useMutation(CREATE_SUBSCRIPTIONS);

  return (
    <Subscribe
      createSubscriptions={createSubscriptions}
      isLoading={loading}
      error={error}
      subscriptions={data && data.createSubscriptions}
    />
  );
}

function App() {
  const { t } = useTranslation();
  const [signedIn, setSignedIn] = useState(localStorage.getItem('happening-signed-in'));

  return (
    <React.StrictMode>
      <ApolloProvider client={client}>
        <div className={classnames('app-root')}>
          <Router>
            <Switch>
              <AuthRoute exact path="/" signedIn={signedIn}>
                <MeetingListView />
              </AuthRoute>
              <AuthRoute path="/subscribe" signedIn={signedIn}>
                <SubscriptionPage />
              </AuthRoute>
              <AuthRoute path="/meeting/:id" signedIn={signedIn}>
                <MeetingView />
              </AuthRoute>
              <AuthRoute path="/confirm/:token/:action" signedIn={signedIn}>
                <EmailConfirmPage />
              </AuthRoute>
              <Route path="/login">
                <LoginHandler setSignedIn={setSignedIn} />
              </Route>

              {/* <Route exact path="/participate/join">
                  <ParticipatePage Component={ParticipateJoin} />
                </Route>
                <Route exact path="/participate/watch">
                  <ParticipatePage Component={ParticipateWatch} />
                </Route>
                <Route exact path="/participate/comment">
                  <ParticipatePage Component={ParticipateComment} />
                </Route>
                <Route exact path="/participate/request">
                  <ParticipatePage Component={ParticipateRequest} />
                </Route> */}

              <AuthRoute path={`${AdminPaths.EDIT_MEETING}/:id`} signedIn={signedIn}>
                <AdminView
                  headerText={t('meeting.actions.edit-info.label')}
                  component={() => <div>Placeholder for Edit Meeting</div>}
                />
              </AuthRoute>

              <AuthRoute path={`${AdminPaths.EDIT_AGENDA}/:id`} signedIn={signedIn}>
                <AdminView
                  headerText="Edit Agenda Items"
                  component={AgendaTable}
                />
              </AuthRoute>
            </Switch>
          </Router>
          <Footer />
          <SampleQuery />
        </div>
      </ApolloProvider>
    </React.StrictMode>
  );
}

ReactDOM.render(
  <Suspense fallback={<div>Loading translation files...</div>}>
    <App />
  </Suspense>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
