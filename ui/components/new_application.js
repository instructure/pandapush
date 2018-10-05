import React from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import TextInput from "@instructure/ui-forms/lib/components/TextInput";
import Button from "@instructure/ui-buttons/lib/components/Button";
import Overlay from "@instructure/ui-overlays/lib/components/Overlay";
import Mask from "@instructure/ui-overlays/lib/components/Mask";
import Spinner from "@instructure/ui-elements/lib/components/Spinner";
import Alert from "@instructure/ui-alerts/lib/components/Alert";
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@instructure/ui-overlays/lib/components/Modal";
import CloseButton from "@instructure/ui-buttons/lib/components/CloseButton";

export default class NewApplication extends React.Component {
  state = {
    name: ""
  };

  onSubmit = e => {
    e.preventDefault();

    const { name } = this.state;

    if (!name) {
      alert("Name is required!");
      return false;
    }

    this.setState({ error: null, saving: true });

    fetch("/admin/api/applications", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        name: name
      })
    })
      .then(response => {
        if (response.status !== 201) {
          throw new Error("Error creating application");
        }

        return response.json();
      })
      .then(json => {
        this.props.onCreated(json.id);
      })
      .catch(e => {
        console.log("error creating application", e);

        this.setState({
          saving: false,
          error: e.message
        });
      });
  };

  render() {
    return (
      <div>
        <Modal
          as="form"
          open={true}
          onSubmit={this.onSubmit}
          size="medium"
          label="New Application"
        >
          <ModalHeader>
            <CloseButton
              placement="end"
              offset="medium"
              variant="icon"
              onClick={this.props.onClose}
            >
              Close
            </CloseButton>
            <Heading>Create New Application</Heading>
          </ModalHeader>
          <ModalBody>
            {this.state.error && (
              <Alert variant="error" closeButtonLabel="Close" margin="small">
                {this.state.error}
              </Alert>
            )}

            <TextInput
              label="Name"
              required
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.props.onClose} margin="0 xx-small 0 0">
              Close
            </Button>
            <Button disabled={!this.state.name} variant="primary" type="submit">
              Submit
            </Button>
          </ModalFooter>
        </Modal>

        <Overlay
          open={this.state.saving}
          transition="fade"
          label="Saving"
          shouldReturnFocus
          shouldContainFocus
        >
          <Mask>
            <Spinner title="Saving" size="large" margin="0 0 0 medium" />
          </Mask>
        </Overlay>
      </div>
    );
  }
}
