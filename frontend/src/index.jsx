import React, { useCallback, useState } from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import './index.scss'

import MeetingView from './components/MeetingView/MeetingView'
import classnames from 'classnames'
import NavigationMenu from './components/Header/NavigationMenu'
import Subscribe from './components/Subscribe/Subscribe'
import MeetingItem from './components/MeetingItem/MeetingItem'
import AdminView from './components/AdminView/AdminView'

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
} from '@apollo/client'
import { GET_ALL_MEETINGS_WITH_ITEMS } from './graphql/graphql'

const client = new ApolloClient({
  // uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
})

function SampleQuery() {
  const { loading, error, data } = useQuery(GET_ALL_MEETINGS_WITH_ITEMS)

  if (loading) console.log('THE Loading: ', loading)
  if (error) console.log('THE Error: ', error)

  console.log(data)

  return null
}

function App() {
  const [showMenu, setShowMenu] = useState(false)

  const toggleMenu = useCallback(() => {
    setShowMenu(!showMenu)
  }, [showMenu, setShowMenu])
  return (
    /* One of the libraries in the table produces quite a few errors
     in the console on Strict Mode:
     https://github.com/bvaughn/react-virtualized/issues/1353 */
    <React.StrictMode>
      <ApolloProvider client={client}>
        <div className={classnames('app-root')}>
          <Router>
            {/* <div className="ribbon" />
                  <Header toggleMenu={toggleMenu} shouldHide={showMenu}/>
                <div className="fade-box" /> */}
            {/* A <Switch> looks through all its children <Route>
              elements and renders the first one whose path
              matches the current URL. Use a <Switch> any time
              you have multiple routes, but you want only one
              of them to render at a time */}
            <Switch>
              <Route exact path="/">
                <MeetingView />
              </Route>
              <Route path="/subscribe/:id">
                <Subscribe />
              </Route>
              <Route path="/meeting-item/:id">
                <MeetingItem />
              </Route>
              <Route exact path="/admin">
                <AdminView />
              </Route>
            </Switch>
            <NavigationMenu toggleMenu={toggleMenu} showMenu={showMenu} />
          </Router>
          <SampleQuery />
        </div>
      </ApolloProvider>
    </React.StrictMode>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
