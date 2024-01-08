import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  BarcodeScannerHookExamplePage,
  // VisonCameraCodeScannerExamplePage,
} from './pages';

export default function App() {
  return (
    <View style={styles.container}>
      {/* <VisonCameraCodeScannerExamplePage /> */}
      <BarcodeScannerHookExamplePage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'chalk',
    position: 'relative',
  },
});
