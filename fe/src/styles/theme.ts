const calRem = (size: number): string => `${size / 16}rem`;

const fontSize = {
  xs: calRem(12),
  sm: calRem(14),
  md: calRem(16),
  lg: calRem(18),
  xl: calRem(20),
};

const len = {
  xs: '0.5rem',
  sm: '1.0rem',
  md: '1.5rem',
  lg: '2.5rem',
  xl: '3.5rem',
};

const color = {
  brandColor: '#5CC6BA',
  subText: '#bababc',
  black: '#171417',
  white: '#fefefe',
  selectedBlue: '#499ae9',
  grayBackground: '#f5f5f5',

  gray: '#e1e1e1',
  darkgray: '#bababc',

  lightBorder: '#e6e6e6',
  green: '#20C997',
  gray2: '#e9ecef',
};

const theme = {
  fontSize,
  color,
  len,
};

export default theme;
