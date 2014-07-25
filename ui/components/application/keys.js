/** @jsx React.DOM */

'use strict';

var React        = require('react'),
    Router       = require('react-router'),
    Route        = Router.Route,
    Link         = Router.Link,
    moment       = require('moment'),
    _            = require('lodash'),
    $            = window.jQuery;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      parsedExpires: ""
    };
  },

  handleExpiresChange: function(e) {
    var m = moment(e.target.value);
    if (!m.isValid()) {
      this.setState({
        parsedExpires: "Uhhhh.... (could not parse expires date)"
      });
    }
    else if (m.isBefore(moment())) {
      this.setState({
        parsedExpires: "Date is in the past."
      });
    }
    else {
      this.setState({
        parsedExpires: "(" + m.toISOString() + ", " + m.fromNow() + ")"
      });
    }

    return false;
  },

  handleKeySubmit: function(e) {
    e.preventDefault();

    var purpose = this.refs["keyPurpose"].getDOMNode().value,
        expiresRaw = this.refs["keyExpires"].getDOMNode().value;

    if (!purpose) {
      alert("Purpose is required!");
      return false;
    }

    var m = moment(expiresRaw);
    if (!m.isValid()) {
      alert("Expires is not valid.");
      return false;
    }

    if (m.isBefore(moment())) {
      alert("Expires is in the past.");
      return false;
    }

    var expires = m.toISOString();

    $.ajax({
      type: 'POST',
      url: '/admin/api/application/' + this.props.params.id + '/keys',
      data: JSON.stringify({
        purpose: purpose,
        expires: expires
      }),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(data) {
        alert('Your new key ID is\n\n' + data.key_id + '\n\n and secret is\n\n' + data.secret + '\n\n' +
              'Copy the secret to a safe place, as you won\'t see it again here.');

        this.props.reload();

        this.refs["keyPurpose"].getDOMNode().value = "";
        this.refs["keyExpires"].getDOMNode().value = "";
      }.bind(this)
    });

    return false;
  },

  renderKeys: function() {
    return _.map(_.sortBy(_.values(this.props.app.keys), 'created_at'), function(key) {
      var status = 'active';
      if (key.revoked_at) {
        status = 'revoked ' + key.revoked_at;
      }
      else if (moment(key.expires).isBefore(moment())) {
        status = 'expired';
      }

      return (
        <tr>
          <td className="identifier">{key.key_id}</td>
          <td>{key.purpose}</td>
          <td>{key.created_at} ({key.created_by})</td>
          <td>{key.expires}</td>
          <td>{status}</td>
          <td> </td>
        </tr>
      );
    });
  },

  render: function() {
    return (
      <div className="container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Purpose</th>
              <th>Created</th>
              <th>Expires</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {this.renderKeys()}
          </tbody>
        </table>

        <h2>Generate New Key</h2>

        <form onSubmit={this.handleKeySubmit} className="form-horizontal" role="form">
          <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor="keyPurpose">Purpose</label>
            <div className="col-sm-6">
              <input type="text" className="form-control" ref="keyPurpose" name="purpose" id="keyPurpose" />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor="keyExpires">Expires</label>
            <div className="col-sm-4">
              <input onChange={this.handleExpiresChange} ref="keyExpires" type="text" className="form-control" name="expires" id="keyExpires" placeholder="iso8601 format plz" />
              <span>{this.state.parsedExpires}</span>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label"></label>
            <div className="col-sm-4">
              <button type="submit" className="btn btn-default">Generate</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
});


