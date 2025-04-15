// pages/test-connection.js
'use client'
import { useEffect, useState } from 'react';

export default function TestConnection() {
  const [status, setStatus] = useState('Verificando conexão...');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        const response = await fetch('/api');
        const data = await response.json();
        setStatus(data.message);
      } catch (err) {
        alert('Erro ao verificar conexão');
        console.error(err);
      }
    }

    checkConnection();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teste de Conexão com MongoDB</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-green-500">{status}</p>
      )}
    </div>
  );
}