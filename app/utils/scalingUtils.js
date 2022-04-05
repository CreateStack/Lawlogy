import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const s = (size) => (width / guidelineBaseWidth) * size; //horizontal
const vs = (size) => (height / guidelineBaseHeight) * size; //vertical
const ms = (size, factor = 0.5) => size + (s(size) - size) * factor; //font/line height (medium scale)

export {s, vs, ms};
