import { Request, Response, RequestHandler } from 'express';
import db from '../database';
import nodemailer from 'nodemailer';

const codigos: Map<string, string> = new Map();

export const enviarCodigo: RequestHandler = async (req, res) => {
  const { correo } = req.body;

  const usuarios: any[] = await db.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
  if (!usuarios || usuarios.length === 0) {
    res.json({ success: false, message: 'Correo no registrado' });
    return;
  }

  const codigo = Math.floor(1000 + Math.random() * 9000).toString();
  codigos.set(correo, codigo);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mitsimy@gmail.com',
      pass: 'nxkl umfw mmho geaa',
    },
  });

  const mensaje = {
    from: 'mitsimy@gmail.com',
    to: correo,
    subject: 'Recuperación de Contraseña',
    html: `<p>Tu código de verificación es: <b>${codigo}</b></p>`,
  };

  await transporter.sendMail(mensaje);
  res.json({ success: true, codigo });

};

export const cambiarContrasena: RequestHandler = async (req, res) => {
  const { correo, contrasena } = req.body;
  await db.query('UPDATE usuario SET contraseña = ? WHERE correo = ?', [contrasena, correo]);
  res.json({ success: true, message: 'Contraseña actualizada' });
};
