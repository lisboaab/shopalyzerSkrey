import connectDB from '../config/db.js';

export async function GET(req) {
  try {
    await connectDB();
    return new Response(JSON.stringify({ message: 'Conexão com MongoDB estabelecida com sucesso!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro na conexão com MongoDB:', error.message);
    return new Response(JSON.stringify({ error: 'Falha ao conectar com o MongoDB', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}