import React from "react";
import Select from "@instructure/ui-forms/lib/components/Select";
import ScreenReaderContent from "@instructure/ui-a11y/lib/components/ScreenReaderContent";

import _ from "lodash";

class AdminInput extends React.Component {
  state = { inputText: "" };

  handleChange = (e, value) => {
    const newAdmins = value.map(v => v.value);
    this.props.onChange(this.cleanedAdmins(newAdmins));
  };

  cleanedAdmins(value) {
    return _.union([this.props.thisUser], value);
  }

  render() {
    const options = this.props.admins.map(a => (
      <option key={a} value={a}>
        {a}
      </option>
    ));

    if (this.state.inputText) {
      options.unshift(
        <option key="_inprogress" value={this.state.inputText}>
          {this.state.inputText}
        </option>
      );
    }

    return (
      <Select
        editable
        selectedOption={this.props.admins.map(a => {
          return { value: a, label: a, dismissible: a !== this.props.thisUser };
        })}
        multiple
        onChange={this.handleChange}
        onInputChange={(e, value) => this.setState({ inputText: value })}
        label={<ScreenReaderContent>Admins</ScreenReaderContent>}
      >
        {options}
      </Select>
    );
  }
}

export default AdminInput;
