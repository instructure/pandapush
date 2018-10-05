import React from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import TextInput from "@instructure/ui-forms/lib/components/TextInput";
import Button from "@instructure/ui-buttons/lib/components/Button";
import Overlay from "@instructure/ui-overlays/lib/components/Overlay";
import Mask from "@instructure/ui-overlays/lib/components/Mask";
import Spinner from "@instructure/ui-elements/lib/components/Spinner";
import DateTimeInput from "@instructure/ui-forms/lib/components/DateTimeInput";
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@instructure/ui-overlays/lib/components/Modal";
import CloseButton from "@instructure/ui-buttons/lib/components/CloseButton";
import moment from "moment";

export default class NewKey extends React.Component {
  state = {
    purpose: "",
    expiration: ""
  };

  onSubmit = e => {
    e.preventDefault();

    const purpose = this.state.purpose;
    const expiresRaw = this.state.expiration;

    if (!purpose) {
      alert("Purpose is required!");
      return false;
    }

    const m = moment(expiresRaw);
    if (!m.isValid()) {
      alert("Expires is not valid.");
      return false;
    }

    if (m.isBefore(moment())) {
      alert("Expires is in the past.");
      return false;
    }

    const expires = m.toISOString();

    this.setState({ saving: true });

    fetch("/admin/api/application/" + this.props.applicationId + "/keys", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        purpose: purpose,
        expires: expires
      })
    })
      .then(response => response.json())
      .then(json => {
        alert(
          "Your new key ID is\n\n" +
            json.id +
            "\n\n and secret is\n\n" +
            json.secret +
            "\n\n" +
            "Copy the secret to a safe place, as you won't see it again here."
        );

        this.props.onCreated();
      });

    return false;
  };

  render() {
    return (
      <div>
        <Modal
          as="form"
          open={true}
          onSubmit={this.onSubmit}
          size="medium"
          label="New Key"
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
            <Heading>Create New Key</Heading>
          </ModalHeader>
          <ModalBody>
            <TextInput
              label="Purpose"
              required
              value={this.state.purpose}
              onChange={e => this.setState({ purpose: e.target.value })}
            />
            <br />
            <DateTimeInput
              description="Expiration"
              dateLabel="Date"
              datePreviousLabel="Previous"
              dateNextLabel="Next"
              timeLabel="Time"
              layout="columns"
              invalidDateTimeMessage="Invalid date/time"
              value={this.state.expiration}
              onChange={(e, value) => this.setState({ expiration: value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.props.onClose} margin="0 xx-small 0 0">
              Close
            </Button>
            <Button
              disabled={!this.state.purpose || !this.state.expiration}
              variant="primary"
              type="submit"
            >
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
