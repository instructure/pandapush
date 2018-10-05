import React from "react";
import Menu, { MenuItem } from "@instructure/ui-menu/lib/components/Menu";
import Button from "@instructure/ui-buttons/lib/components/Button";
import IconArrowOpenDown from "@instructure/ui-icons/lib/Line/IconArrowOpenDown";

export default class EnvironmentSelector extends React.Component {
  render() {
    const environments = this.props.environments.map(e => {
      const isCurrent = e.name === this.props.environment;
      return (
        <MenuItem
          key={e.name}
          href={isCurrent ? null : e.url}
          selected={isCurrent}
          disabled={isCurrent}
        >
          {e.name}
        </MenuItem>
      );
    });

    return (
      <Menu
        placement="bottom"
        trigger={
          <Button icon={<IconArrowOpenDown />}>{this.props.environment}</Button>
        }
      >
        {environments}
      </Menu>
    );
  }
}
