import React from 'react';
import _ from 'lodash';

import StoryList from '../StoryList';

import { hnApi } from '../api';

class StoryListWithData extends React.Component {
  state = {
    displayStatus: 'Loading',
    stories: [],
  };

  displayStatus(displayStatus) {
    this.setState({ displayStatus });
  }
  componentWillMount() {
    this.displayStatus('Loading Top Stories List');
    hnApi('topstories')
      .then(topStoryIds => _.sampleSize(topStoryIds, 10))
      .then(topStoryIds => {
        this.displayStatus('Loading Top Stories Details');

        return Promise.all(
          topStoryIds.map(id =>
            hnApi(`item/${id}`).then(story =>
              hnApi(`user/${story.by}`).then(author => ({
                ...story,
                author,
              })),
            ),
          ),
        );
      })
      .then(topStoriesWithAuthors => {
        this.setState({
          stories: topStoriesWithAuthors,
        });
      })
      .catch(console.error);
  }
  render() {
    const { stories, displayStatus } = this.state;
    return (
      <span>
        {!stories.length ? displayStatus : <StoryList stories={stories} />}
      </span>
    );
  }
}

export default StoryListWithData;
