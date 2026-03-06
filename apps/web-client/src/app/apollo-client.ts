import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const httpLink = new HttpLink({
  uri: `${baseUrl}/graphql`,
});

/**
 * Note the flipped arguments: (previousContext, operation)
 * Requirement: Secure SPA Architecture (JWT Injection).
 */
const authLink = new SetContextLink((prevContext, _operation) => {
  const token = localStorage.getItem('user_token');

  return {
    ...prevContext,
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

/**
 * Chains the authLink and httpLink together.
 */
export const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
