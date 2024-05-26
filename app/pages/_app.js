// pages/_app.js
import '../styles/globals.css';
import WalletConnectionProvider from '../components/WalletProvider';

function MyApp({ Component, pageProps }) {
  return (
    <WalletConnectionProvider>
      <Component {...pageProps} />
    </WalletConnectionProvider>
  );
}

export default MyApp;
