import React from "react";
import Select from "@instructure/ui-forms/lib/components/Select";
import Flex, { FlexItem } from "@instructure/ui-layout/lib/components/Flex";
import TextInput from "@instructure/ui-forms/lib/components/TextInput";
import ScreenReaderContent from "@instructure/ui-a11y/lib/components/ScreenReaderContent";

export default class ChannelPicker extends React.Component {
  get = () => {
    return (
      "/" +
      this.props.applicationId +
      "/" +
      this.props.type +
      "/" +
      this.props.path
    );
  };

  render() {
    const options = [
      <option key="public" value="public">
        public
      </option>,
      <option key="private" value="private">
        private
      </option>
    ];

    if (this.props.showPresence) {
      options.push(
        <option key="presence" value="presence">
          presence
        </option>
      );
    }

    if (this.props.showMeta) {
      options.push(
        <option key="meta" value="meta">
          meta
        </option>
      );
    }

    return (
      <div
        style={{
          backgroundColor: "#fafafa",
          border: "1px solid #eee",
          borderRadius: "3px",
          margin: "10 0",
          paddingLeft: "10px"
        }}
      >
        <Flex>
          <FlexItem padding="x-small">/</FlexItem>
          <FlexItem padding="x-small">{this.props.applicationId}</FlexItem>
          <FlexItem padding="x-small">/</FlexItem>
          <FlexItem padding="x-small">
            <Select
              width="8em"
              label={<ScreenReaderContent>Path Type</ScreenReaderContent>}
              selectedOption={this.props.type}
              onChange={(_, { value }) => {
                this.props.updateParams({
                  channelType: value,
                  path: this.props.path
                });
              }}
            >
              {options}
            </Select>
          </FlexItem>
          <FlexItem padding="x-small">/</FlexItem>
          <FlexItem padding="x-small" grow>
            <TextInput
              label={<ScreenReaderContent>Path</ScreenReaderContent>}
              value={this.props.path}
              onChange={e => {
                this.props.updateParams({
                  channelType: this.props.type,
                  path: e.target.value
                });
              }}
            />
          </FlexItem>
        </Flex>
      </div>
    );
  }
}
