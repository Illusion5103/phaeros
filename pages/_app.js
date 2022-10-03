import '../styles/global.css';
import { ThemeProvider } from 'next-themes';

export default function App({ Component, pageProps }) {
    return (
      <ThemeProvider forcedTheme={'dark'} attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    )
  }
  