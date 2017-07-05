// This is a temp file that should be deleted
import * as React from 'react';

export interface IQueryRendererProps {
  results: any;
}

export default class QueryRenderer extends React.PureComponent<IQueryRendererProps, void> {
  render() {
    return (
      <div className="QueryRenderer">
        <pre className="QueryRenderer-results">{this.props.results}</pre>
      </div>
    );
  }
}