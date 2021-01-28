import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { ApolloClient, ApolloProvider, InMemoryCache,createHttpLink } from "@apollo/client";
import { setContext } from "apollo-link-context";
import {URL} from './config'


const httpLink = createHttpLink({
    uri: URL
})

const authLink = setContext(() => {
    const token = localStorage.getItem('jwtToken');
    return{
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})

//import ApolloProvider from './ApolloProvider';

ReactDOM.render(
  <ApolloProvider client={client}>
      <App/>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
