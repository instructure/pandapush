import React from 'react';
import AdminInput from './admin_input';

class Info extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      editing: false
    };
  }

  handleAdminChange = (value) => {
    this.setState({
      admins: value
    });
  }

  handleChange = (field, e) => {
    this.setState({
      [field]: e.target.value
    });
  }

  handleEdit = () => {
    this.setState({
      name: this.props.app.name,
      admins: this.props.app.admins,
      editing: true
    });
  }

  handleCancel = () => {
    this.setState({ editing: false });
  }

  handleSave = () => {
    fetch('/admin/api/application/' + this.props.app.id, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        name: this.state.name,
        admins: this.state.admins
      })
    }).then(response => response.json())
      .then(json => {
        this.props.reload();
        this.setState({
          name: null,
          admins: null,
          editing: false
        });
      })
      .catch(e => {
        console.log('error saving application', e);
        alert('error saving application', e);
      });
  }

  render () {
    return (
      <div className="container">
        <table className="table">
          <thead>
            <tr>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ID</td>
              <td className="identifier">{this.props.params.id}</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>{
                this.state.editing
                ? <input className="form-control" type="text" value={this.state.name} onChange={this.handleChange.bind(this, 'name')} />
                : this.props.app.name
              }</td>
            </tr>
            <tr>
              <td>Created At</td>
              <td>{this.props.app.created_at}</td>
            </tr>
            <tr>
              <td>Created By</td>
              <td>{this.props.app.created_by}</td>
            </tr>
            <tr>
              <td>Admins</td>
              <td>{
                this.state.editing
                ? <div>
                    <AdminInput
                      onChange={this.handleAdminChange}
                      thisUser={this.props.username}
                      admins={this.state.admins} />
                  </div>
                : this.props.app.admins.join(', ')
              }</td>
            </tr>
          </tbody>
        </table>

        {
          this.state.editing
          ? <div>
              <button onClick={this.handleSave} className="btn btn-default">Save</button>&nbsp;
              <button onClick={this.handleCancel} className="btn btn-default">Cancel</button>
            </div>
          : <button onClick={this.handleEdit} className="btn btn-default">Edit</button>
        }

      </div>
    );
  }
}

module.exports = Info;
