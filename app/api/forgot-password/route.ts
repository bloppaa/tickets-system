import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { sendResetEmail } from '@/utils/sendResetEmail';

const secretKey = process.env.JWT_SECRET_KEY || 'mysecretkey';

export async function POST(req: Request) {
  const { email } = await req.json();
  console.log(email);
  const userExists = email;

  if (!userExists) {
    console.log('ardiles hueco')
    return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
  }

  const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
  console.log(token);
  try {
    await sendResetEmail(email, token);
    return NextResponse.json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    return NextResponse.json({ message: 'Error enviando el correo' }, { status: 500 });
  }
}
