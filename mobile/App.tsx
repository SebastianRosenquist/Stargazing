import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { RitualScreen } from './src/screens/RitualScreen';
import { ThemePicker } from './src/components/ThemePicker';
import { useCustomMeditation } from './src/hooks/useCustomMeditation';
import { useActiveTheme } from './src/themes/ThemeProvider';

export default function App() {
  const { status, authorName, customTheme } = useCustomMeditation();
  const { setTheme } = useActiveTheme();
  const [pickerDone, setPickerDone] = useState(false);

  // Deep-linked custom meditations skip the picker entirely — promote the
  // ad-hoc theme built from the shared link as soon as it resolves, so
  // RitualScreen only ever has one code path (read the active theme).
  useEffect(() => {
    if (status === 'custom' && customTheme) {
      setTheme(customTheme);
    }
  }, [status, customTheme, setTheme]);

  if (status === 'pending') return <View style={styles.blank} />;
  if (status === 'custom') return <RitualScreen authorName={authorName} />;

  if (!pickerDone) {
    return (
      <ThemePicker
        onBegin={(theme) => {
          setTheme(theme);
          setPickerDone(true);
        }}
      />
    );
  }

  return <RitualScreen authorName={authorName} />;
}

const styles = StyleSheet.create({
  blank: {
    flex: 1,
    backgroundColor: '#090a0f',
  },
});
