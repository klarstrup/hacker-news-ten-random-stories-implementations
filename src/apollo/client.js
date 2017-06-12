import schema from './schema';

import { ApolloClient } from 'react-apollo';

import { execute } from 'graphql';

const networkInterface = {
  query: ({ query, variables, operationName }) =>
    execute(
      schema,
      query,
      undefined,
      undefined,
      variables,
      operationName,
    ).catch(console.error),
};

export default new ApolloClient({
  networkInterface,
  dataIdFromObject: ({ id, __typename }) =>
    __typename === 'Status' ? 'status' : `${__typename}.${id}`,
});
