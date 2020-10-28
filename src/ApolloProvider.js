import React from 'react';
import App from './App';
import ApolloClient from 'apollo-client';
import { createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import {setContext} from 'apollo-link-context'

const httpLink = createHttpLink({
  uri: 'https://posts-sharing.herokuapp.com/'
})

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken')
  return {
    headers: {
      Authorization: token ? `Token ${token}` : ''
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)