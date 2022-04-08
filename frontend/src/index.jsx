import React, { Suspense, useState } from "react";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import "./index.scss";

import classnames from "classnames";
import { useTranslation } from "react-i18next";
import MeetingListView from "./components/MeetingListView/MeetingListView";
import AgendaTable from "./components/AgendaTable/AgendaTable";
import MeetingView from "./components/MeetingView/MeetingView";
import Subscribe from "./components/Subscribe/Subscribe";
import AdminView from "./components/AdminView/AdminView";
import EmailConfirmPage from "./components/EmailConfirmPage/EmailConfirmPage";
import Footer from "./components/Footer/Footer";
import LoginHandler from "./components/LoginHandler/LoginHandler";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import LoginContext from "./components/LoginContext/LoginContext";
import AccountCreate from "./components/UserAccountCreate/AccountCreate";
import ForgotPassword from "./components/ForgotPassword/ForgotPasswordRequest";
import SetNewPassword from "./components/ForgotPassword/SetNewPassword";
import FAQ from "./components/FAQ/FAQ.jsx";

import * as serviceWorker from "./serviceWorker";

import { GET_ALL_MEETINGS_WITH_ITEMS } from "./graphql/graphql";
import AdminPaths from "./constants/AdminPaths";
import LocalStorageTerms from "./constants/LocalStorageTerms";
import verifyToken from "./utils/verifyToken";
import "./i18n";

const httpLink = new BatchHttpLink({
  uri: `${process.env.REACT_APP_GRAPHQL_URL}/graphql`,
  batchMax: 100,
});

//
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = window.localStorage.getItem(LocalStorageTerms.TOKEN);

  // if the token is valid use it, else attach no token  to header
  return {
    headers: {
      ...headers,
      authorization: verifyToken() ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function SampleQuery() {
  const { loading, error, data } = useQuery(GET_ALL_MEETINGS_WITH_ITEMS);

  // eslint-disable-next-line no-console
  if (loading) console.log("THE Loading: ", loading);
  // eslint-disable-next-line no-console
  if (error) console.log("THE Error: ", error);

  // eslint-disable-next-line no-console
  console.log(data);

  return null;
}

const initializeSignIn = () => {
  const tokenSignedIn = window.localStorage.getItem(
    LocalStorageTerms.SIGNED_IN
  );

  // provides verification to the front-end the login status
  const loggedIn = verifyToken() && tokenSignedIn;
  window.localStorage.setItem(LocalStorageTerms.SIGNED_IN, loggedIn);

  return loggedIn;
};

function App() {
  const { t } = useTranslation();
  const [signedIn, setSignedIn] = useState(initializeSignIn);

  return (
    <React.StrictMode>
      <ApolloProvider client={client}>
        <LoginContext.Provider value={{ setSignedIn, signedIn }}>
          <div className={classnames("app-root")}>
            <Router>
              <Switch>
                <AuthRoute exact path="/" signedIn={signedIn}>
                  <MeetingListView />
                </AuthRoute>
                <AuthRoute path="/subscribe" signedIn={signedIn}>
                  <Subscribe />
                </AuthRoute>
                <AuthRoute path="/meeting/:id" signedIn={signedIn}>
                  <MeetingView />
                </AuthRoute>
                <AuthRoute path="/confirm/:token/:action" signedIn={signedIn}>
                  <EmailConfirmPage />
                </AuthRoute>
                <Route path="/login">
                  <LoginHandler />
                </Route>
                <Route path="/account-create">
                  <AccountCreate />
                </Route>
                <Route path="/forgot-password">
                  <ForgotPassword />
                </Route>
                <Route path="/reset-password">
                  <SetNewPassword />
                </Route>
                <Route exact path="/faq">
                  <FAQ />
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

                <AuthRoute
                  path={`${AdminPaths.EDIT_MEETING}/:id`}
                  signedIn={signedIn}
                >
                  <AdminView
                    headerText={t("meeting.actions.edit-info.label")}
                    component={() => <div>Placeholder for Edit Meeting</div>}
                  />
                </AuthRoute>

                <AuthRoute
                  path={`${AdminPaths.EDIT_AGENDA}/:id`}
                  signedIn={signedIn}
                >
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
        </LoginContext.Provider>
      </ApolloProvider>
    </React.StrictMode>
  );
}

ReactDOM.render(
  <Suspense fallback={<div>Loading translation files...</div>}>
    <App />
  </Suspense>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
