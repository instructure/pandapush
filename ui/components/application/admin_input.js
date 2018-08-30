import React from "react";
import ReactTags from "react-tag-autocomplete";
import _ from "lodash";

class AdminInput extends React.Component {
  handleDelete = idx => {
    const newList = this.props.admins.slice(0);
    newList.splice(idx, 1);
    this.props.onChange(this.cleanedAdmins(newList));
  };

  handleAdd = tag => {
    let newList = _.union(this.props.admins, [tag.name]);
    this.props.onChange(this.cleanedAdmins(newList));
  };

  cleanedAdmins(value) {
    return _.union([this.props.thisUser], value);
  }

  render() {
    return (
      <ReactTags
        tags={this.props.admins.map(a => {
          return { id: a, name: a };
        })}
        handleDelete={this.handleDelete}
        handleAddition={this.handleAdd}
        allowNew={true}
        inputAttributes={{ maxLength: 100 }}
        delimiterChars={[",", " "]}
        placeholder="Add username"
      />
    );
  }
}

export default AdminInput;
