// pages/index.js
import Head from 'next/head';
import Header from '../components/Header';
import SlotMachine from '../components/SlotMachine';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Solana DApp</title>
        <meta name="description" content="Solana DApp with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />
        <SlotMachine />
      </main>
    </div>
  );
}
