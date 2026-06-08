import StyleSheet from 'react-native-web/dist/exports/StyleSheet'

export default {
  resolve(style) {
    return style ? StyleSheet.flatten(style) : {}
  }
}
