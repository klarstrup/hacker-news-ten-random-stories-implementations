import React from 'react';

import { gql, ApolloProvider, graphql } from 'react-apollo';

import StoryList from '../StoryList';

import client from './client';

const StoryListWithData = graphql(
  gql`query { 
  topStories(shuffle: true, limit: 10) {
    id
    title
    score
    time
    url
    author {
      id
      karma
    }
  }
}`,
  {
    props: ({ ownProps, data: { loading, topStories = [] } }) => ({
      stories: topStories,
      loading,
    }),
  },
)(
  ({ loading, ...props }) =>
    loading ? <span>Loading...</span> : <StoryList {...props} />,
);

export default () =>
  <ApolloProvider client={client}>
    <StoryListWithData />
  </ApolloProvider>;
