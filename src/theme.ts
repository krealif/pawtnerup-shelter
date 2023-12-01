import { Poppins } from 'next/font/google';
import { createTheme, MantineColorsTuple } from '@mantine/core';

export const poppins = Poppins({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
});

const sunsetColor: MantineColorsTuple = [
  '#ffe9e7',
  '#ffd3cf',
  '#fca49f',
  '#f9736b',
  '#f6493f',
  '#f52f22',
  '#f52013',
  '#db1208',
  '#c30805',
  '#ac0000',
];

export const theme = createTheme({
  fontFamily: poppins.style.fontFamily,
  primaryColor: 'dark',
  cursorType: 'pointer',
  colors: {
    sunset: sunsetColor,
  },
  components: {
    AppShell: {
      styles: {
        main: { backgroundColor: 'var(--mantine-color-gray-0)' },
      },
    },
    NavLink: {
      styles: {
        root: { borderRadius: 'var(--mantine-radius-default)' },
        label: { fontWeight: 500 },
      },
    },
  },
});
