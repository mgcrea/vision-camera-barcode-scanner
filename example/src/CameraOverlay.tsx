import React, {type FunctionComponent} from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const CameraOverlay: FunctionComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.unfocusedArea} />

        <View style={styles.focusedArea}>
          <View style={styles.unfocusedArea} />
          <View style={styles.clearArea} />
          <View style={styles.unfocusedArea} />
        </View>

        <View style={styles.unfocusedArea} />
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Align barcode within area to scan
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  unfocusedArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // light blue
  },
  focusedArea: {
    flex: 2,
    flexDirection: 'row',
  },
  clearArea: {
    flex: 6,
    borderColor: 'peachpuff', // light pink
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  instructions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 32,
    backgroundColor: 'rgba(0,0,0,0.5)', // light blue
  },
  instructionsText: {
    color: '#fff', // light pink
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 18,
  },
});
