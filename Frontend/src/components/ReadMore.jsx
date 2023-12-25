import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ReadMore from 'react-native-read-more-text';

export class ReadMoreComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={[styles.footerText, this.props.textStyle]} onPress={handlePress}>
        Read more
      </Text>
    );
  }

  renderRevealedFooter = (handlePress) => {
    return (
      <Text style={[styles.footerText, this.props.textStyle]} onPress={handlePress}>
        Show less
      </Text>
    );
  }

  toggleReadMore = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { expanded } = this.state;
    const { truncatedText, fullText, textStyle = {} } = this.props;

    return (
      <View>
        {expanded ? (
          <Text style={[{}, textStyle]}>
            {fullText}
          </Text>
        ) : (
          <ReadMore
            numberOfLines={3}
            renderTruncatedFooter={this.renderTruncatedFooter}
            renderRevealedFooter={this.renderRevealedFooter}
          >
            <Text style={[{}, textStyle]}>
              {truncatedText}
            </Text>
          </ReadMore>
        )}
        {truncatedText && truncatedText.length > 0 && (
          <TouchableOpacity onPress={this.toggleReadMore}>
            <Text style={[styles.footerText, textStyle]}>
              {expanded ? 'Show less' : 'Read more'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footerText: {
    color: 'grey',
    marginTop: 5,
  },
});
