import React from 'react';
import { provideState, injectState, softUpdate, hardUpdate } from 'freactal';

import _ from 'lodash';

import StoryList from '../StoryList';

import { hnApi } from '../api';

const wrapComponentWithState = provideState({
  initialState: () => ({
    topStoryIds: [],
    topStoryIdsLoaded: false,
    tenTopStoryIds: [],
    theTenTopStoriesLoaded: false,
    theTenTopStoriesAuthorsLoaded: false,
    theTenTopStoriesAndTheirAuthorsLoaded: false,
    stories: {},
    authors: {},
  }),
  effects: {
    loadTopStoryIds: () =>
      hnApi('topstories').then(topStoryIds => state => ({
        ...state,
        topStoryIds,
        topStoryIdsLoaded: true,
      })),
    loadStoryAndAuthorByStoryId: (effects, id) =>
      hnApi(`item/${id}`)
        .then(story =>
          hnApi(`user/${story.by}`).then(author => ({ story, author })),
        )
        .then(({ story, author }) => state => ({
          ...state,
          stories: { ...state.stories, [id]: story },
          authors: { ...state.authors, [story.by]: author },
        })),
    pickTenTopStories: softUpdate(state => ({
      tenTopStoryIds: _.sampleSize(state.topStoryIds, 10),
    })),
    setTheTenTopStoriesAndTheirAuthorsLoaded: hardUpdate({
      theTenTopStoriesAndTheirAuthorsLoaded: true,
    }),
    loadTheTenTopStoriesAndTheirAuthors: effects => state => {
      Promise.all(
        state.tenTopStoryIds.map(storyId =>
          effects.loadStoryAndAuthorByStoryId(storyId),
        ),
      ).then(() => effects.setTheTenTopStoriesAndTheirAuthorsLoaded());
      return state;
    },
  },
  computed: {
    tenTopStoriesWithAuthors: ({ stories, authors, tenTopStoryIds }) =>
      tenTopStoryIds.map(storyId => {
        const story = stories[storyId];
        const author = authors[story.by];
        return {
          ...story,
          author,
        };
      }),
  },
});

class StoryListContainer extends React.Component {
  componentWillMount() {
    const {
      props: {
        effects: {
          loadTopStoryIds,
          pickTenTopStories,
          loadTheTenTopStoriesAndTheirAuthors,
        },
      },
    } = this;

    loadTopStoryIds()
      .then(() => pickTenTopStories())
      .then(() => loadTheTenTopStoriesAndTheirAuthors());
  }
  render() {
    const { state } = this.props;

    return (
      <div>
        {state.theTenTopStoriesAndTheirAuthorsLoaded
          ? <StoryList stories={state.tenTopStoriesWithAuthors} />
          : 'Loading'}
      </div>
    );
  }
}

const StoryListWithState = wrapComponentWithState(
  injectState(StoryListContainer),
);

export default StoryListWithState;
