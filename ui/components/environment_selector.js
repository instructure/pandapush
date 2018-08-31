import React from "react";

class EnvironmentSelector extends React.Component {
  render() {
    const environments = this.props.environments.map(e => {
      const className = `dropdown-item ${
        e.name === this.props.environment ? "disabled" : ""
      }`;
      return (
        <li key={e.name}>
          <a
            aria-disabled={e.name === this.props.environment}
            className={className}
            href={e.url}
          >
            {e.name}
          </a>
        </li>
      );
    });

    return (
      <>
        <a
          className="dropdown-toggle"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {this.props.environment} <span className="caret" />
        </a>
        <ul className="dropdown-menu" aria-labelledby="environmentDropdown">
          {environments}
        </ul>
      </>
    );
  }
}

export default EnvironmentSelector;
