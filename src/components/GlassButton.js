import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';

export default function GlassButton({ title, onPress, icon }) {
  return (
    <TouchableOpacity 
      style={styles.button} 
      activeOpacity={0.7} 
      onPress={onPress}
    >
      <Ionicons name={icon} size={20} color={Colors.white} style={{marginRight: 8}} />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  text: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});