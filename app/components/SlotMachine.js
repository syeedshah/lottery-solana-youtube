// components/SlotMachine.js
import React, { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram, clusterApiUrl } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import idl from '../idl/slot_machine.json'; // Adjust the path if necessary

const programId = new PublicKey("5T1wvpdaFRGMrdbGoJk2tTPv6HHFnJpMDBovFCHJCfrP");
const slotMachinePubkey = new PublicKey('3vS9JGAMzyPBZrKZhJBzRdAL7GhPAgAPRscWgb155EeP');

const SlotMachine = () => {
  const { publicKey, sendTransaction, connected } = useWallet();
  const [result, setResult] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDeposit = useCallback(async () => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet!');
      return;
    }

    const lamports = 1 * 1000000000; // 1 SOL in lamports

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: slotMachinePubkey,
        lamports,
      })
    );

    try {
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      alert('Deposit successful!');
    } catch (error) {
      console.error('Deposit failed', error);
      alert('Deposit failed');
    }
  }, [connected, publicKey, sendTransaction, connection]);

  const handleSpin = useCallback(async () => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet!');
      return;
    }

    const provider = new anchor.AnchorProvider(connection, window.solana, anchor.AnchorProvider.defaultOptions());
    const program = new anchor.Program(idl, programId, provider);

    try {
      const tx = await program.methods.spin(new anchor.BN(250_000_000)) // 0.25 SOL in lamports
        .accounts({
          slotMachine: slotMachinePubkey,
          user: publicKey,
          systemProgram: SystemProgram.programId,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        })
        .rpc();

      await connection.confirmTransaction(tx);
      alert('Spin successful!');
    } catch (error) {
      console.error('Spin failed', error);
      alert('Spin failed');
    }
  }, [connected, publicKey, connection]);

  if (!isMounted) {
    return null; // Prevent server-side rendering mismatch
  }

  return (
    <div>
      <h2>Solana Slot Machine</h2>
      {connected && publicKey ? (
        <p>Connected: {publicKey.toBase58()}</p>
      ) : (
        <p>Please connect your wallet</p>
      )}
      <button onClick={handleDeposit}>Deposit 1 SOL</button>
      <button onClick={handleSpin}>Spin</button>
      {result && <p>{result}</p>}
    </div>
  );
};

export default SlotMachine;
