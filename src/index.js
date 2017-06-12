import React from 'react';
import { render } from 'react-dom';
import _ from 'lodash';

import StoryListSetState from './setState';
import StoryListFreactal from './freactal';
import StoryListApollo from './apollo';

const storyListImplementations = [
  {
    name: 'React Apollo',
    component: StoryListApollo,
  },
  {
    name: 'React Freactal',
    component: StoryListFreactal,
  },
  {
    name: 'React setState',
    component: StoryListSetState,
  },
];

class StoryListImplementationPicker extends React.Component {
  state = {
    activeImplementation: 0,
  };

  refresh() {
    window.__APOLLO_CLIENT__ && window.__APOLLO_CLIENT__.resetStore();
    this.setState({
      refreshToken: new Date().getTime(),
    });
  }

  handleChange = event => {
    window.__APOLLO_CLIENT__ && window.__APOLLO_CLIENT__.resetStore();
    this.setState({ activeImplementation: event.target.value });
  };

  render() {
    const { implementations } = this.props;
    const { activeImplementation, refreshToken } = this.state;

    const CurrentImplementation =
      implementations[activeImplementation].component;

    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick a state management solution:
          <select value={activeImplementation} onChange={this.handleChange}>
            {implementations.map(({ name }, index) =>
              <option value={index} key={index}>{name}</option>,
            )}
          </select>
        </label>
        <button
          onClick={event => {
            event.preventDefault();
            this.refresh();
          }}
        >
          Refresh
        </button>
        <br />
        <CurrentImplementation key={refreshToken} />
      </form>
    );
  }
}

const App = () =>
  <StoryListImplementationPicker implementations={storyListImplementations} />;

render(<App />, document.getElementById('root'));
