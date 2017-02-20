import React from 'react';
import moment from 'moment';
import _ from 'lodash';

class Keys extends React.Component {
  state = {
    parsedExpires: ''
  }

  handleExpiresChange = (e) => {
    const m = moment(e.target.value);
    if (!m.isValid()) {
      this.setState({
        parsedExpires: 'Uhhhh.... (could not parse expires date)'
      });
    } else if (m.isBefore(moment())) {
      this.setState({
        parsedExpires: 'Date is in the past.'
      });
    } else {
      this.setState({
        parsedExpires: '(' + m.toISOString() + ', ' + m.fromNow() + ')'
      });
    }

    return false;
  }

  handleKeySubmit = (e) => {
    e.preventDefault();

    const purpose = this.keyPurposeInput.value;
    const expiresRaw = this.keyExpiresInput.value;

    if (!purpose) {
      alert('Purpose is required!');
      return false;
    }

    const m = moment(expiresRaw);
    if (!m.isValid()) {
      alert('Expires is not valid.');
      return false;
    }

    if (m.isBefore(moment())) {
      alert('Expires is in the past.');
      return false;
    }

    const expires = m.toISOString();

    fetch('/admin/api/application/' + this.props.params.id + '/keys', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        purpose: purpose,
        expires: expires
      })
    }).then(response => response.json())
      .then(json => {
        alert('Your new key ID is\n\n' + json.id + '\n\n and secret is\n\n' + json.secret + '\n\n' +
              'Copy the secret to a safe place, as you won\'t see it again here.');

        this.props.reload();

        this.keyPurposeInput.value = '';
        this.keyExpiresInput.value = '';
      });

    return false;
  }

  renderKeys () {
    return _(this.props.app.keys)
      .values()
      .sortBy('created_at')
      .map(key => {
        let status = 'active';
        if (key.revoked_at) {
          status = 'revoked ' + key.revoked_at;
        } else if (moment(key.expires).isBefore(moment())) {
          status = 'expired';
        }

        return (
          <tr key={key.id}>
            <td className="identifier">{key.id}</td>
            <td>{key.purpose}</td>
            <td>{key.created_at} ({key.created_by})</td>
            <td>{key.expires}</td>
            <td>{status}</td>
            <td> </td>
          </tr>
        );
      })
      .value();
  }

  render () {
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
              <input type="text" className="form-control" ref={e => (this.keyPurposeInput = e)} name="purpose" id="keyPurpose" />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor="keyExpires">Expires</label>
            <div className="col-sm-4">
              <input onChange={this.handleExpiresChange} ref={e => (this.keyExpiresInput = e)} type="text" className="form-control" name="expires" id="keyExpires" placeholder="iso8601 format plz" />
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
}

module.exports = Keys;
