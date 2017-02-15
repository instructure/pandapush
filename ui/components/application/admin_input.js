import React from 'react';
import Tokenizer from 'react-tokenizer';
import _ from 'lodash';

class AdminInput extends React.Component {
  cleanedAdmins (value) {
    return _.union([ this.props.thisUser ], value);
  }

  handleRemove = (value) => {
    const newList = _.without(this.props.admins, value);
    this.props.onChange(this.cleanedAdmins(newList));
  }

  handleTokenize = (value) => {
    const current = this.props.admins;
    const newList = _.union(current, [ value ]);
    this.props.onChange(this.cleanedAdmins(newList));
  }

  render () {
    return (
      <Tokenizer
        tokens={this.props.admins}
        tokenize={this.handleTokenize}
        removeToken={this.handleRemove} />
    );
  }
}

export default AdminInput;
