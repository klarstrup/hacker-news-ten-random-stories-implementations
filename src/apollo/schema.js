import _ from 'lodash';

import {
  GraphQLSchema,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLString,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLList,
} from 'graphql';

import { hnApi } from '../api';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLString,
    },
    karma: {
      type: GraphQLInt,
    },
  },
});

const ItemType = new GraphQLObjectType({
  name: 'Item',
  fields: {
    id: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    score: {
      type: GraphQLString,
    },
    time: {
      type: GraphQLString,
    },
    url: {
      type: GraphQLString,
    },
    author: {
      type: UserType,
      resolve: ({ by }) => hnApi(`user/${by}`),
    },
  },
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    topStories: {
      type: new GraphQLList(ItemType),
      args: {
        limit: {
          type: GraphQLInt,
        },
        shuffle: {
          type: GraphQLBoolean,
        },
      },
      resolve: (obj, { limit = 100, shuffle = false }) =>
        hnApi('topstories')
          .then(itemIds => {
            if (shuffle) {
              return _.sampleSize(itemIds, limit);
            } else {
              return itemIds.slice(0, limit);
            }
          })
          .then(itemIds => Promise.all(itemIds.map(id => hnApi(`item/${id}`)))),
    },
  },
});

export default new GraphQLSchema({ query: QueryType });
