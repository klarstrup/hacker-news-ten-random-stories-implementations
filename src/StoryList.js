import React from 'react';
import timeago from 'timeago.js';

import _ from 'lodash';

function extractRootDomain(url = '') {
  if (url.indexOf('://') > -1) {
    return url.split('://')[1].split('/')[0];
  }
  return url.split('/')[0];
}

const Story = ({ title, url, time, score, author = {} }) =>
  <article>
    <a href={url}>{title}</a> {url && `(${extractRootDomain(url)})`}
    <br />
    {score} points by {author.id}({author.karma})
    {' '}{timeago().format(time * 1000)}
  </article>;

const StoryList = ({ stories }) =>
  <ul>
    {_.orderBy(stories, 'score').map(story =>
      <li key={story.id}>
        <Story {...story} />
      </li>,
    )}
  </ul>;

export default StoryList;
