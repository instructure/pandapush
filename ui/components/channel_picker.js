import React from 'react';

class ChannelPicker extends React.Component {
  state = {}

  handleType(val) {
    return function(e) {
      e.preventDefault();

      this.setState({
        type: val
      });

      this.props.updateParams({
        channelType: val,
        path: this.inputElement.value
      });

      return false;
    }.bind(this);
  }

  updateParams = () => {
    this.props.updateParams({
      channelType: this.state.type || this.props.type,
      path: this.inputElement.value
    });
  }

  get = () => {
    return '/' + this.props.applicationId +
           '/' + (this.state.type || this.props.type) +
           '/' + this.inputElement.value;
  }

  render() {
    return (
      <div className="input-group">
        <div className="input-group-btn">
          <button type="button" className="btn btn-default" disabled="disabled">/</button>
          <button type="button" className="btn btn-default identifier">{this.props.applicationId}</button>
          <button type="button" className="btn btn-default" disabled="disabled">/</button>
          <div className="btn-group">
            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">{this.state.type || this.props.type} <span className="caret"></span></button>
            <ul className="dropdown-menu" role="menu">
              <li><a onClick={this.handleType('public')} href="#">public</a></li>
              <li><a onClick={this.handleType('private')} href="#">private</a></li>
              <li className={this.props.showPresence ? '' : 'hidden'}><a onClick={this.handleType('presence')} href="#">presence</a></li>
              <li className={this.props.showMeta ? '' : 'hidden'}><a onClick={this.handleType('meta')} href="#">meta</a></li>
            </ul>
          </div>
          <button type="button" className="btn btn-default" disabled="disabled">/</button>
        </div>
        <input onChange={this.updateParams} type="text" ref={e => this.inputElement = e} className="form-control" value={this.props.path} />
      </div>
    );
  }
}

module.exports = ChannelPicker;