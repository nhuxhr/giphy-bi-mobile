import React from 'react';
import { Image } from 'react-native';
import { normalize } from '../utils';

interface ILogoProps {
  style?: 'light' | 'dark';
  height?: number;
  width?: number;
}

const Logo = ({ style = 'light', height = normalize(30), width = normalize(120), ...props }: ILogoProps) => {
  return <Image style={{ height, width }} source={style === 'dark' ? require('../assets/images/logo-dark.png') : require('../assets/images/logo.png')} {...props} />;
};

export default Logo;
