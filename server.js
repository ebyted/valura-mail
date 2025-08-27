require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

// Configura el transporte SMTP (ejemplo con Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const app = express();
const port = process.env.PORT || 3015;

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Ruta para manejar el formulario de cotización
app.post('/api/cotizacion', async (req, res) => {
  const formData = req.body;

  // Template elegante y alineado para el correo de confirmación
  const confirmationTemplate = `
    <div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: auto;">
      <h2 style="color: #005baa; text-align: center;">¡Gracias por tu solicitud, ${formData.nombre}!</h2>
      <p style="text-align: center;">Hemos recibido tu solicitud de cotización. Aquí tienes el detalle:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tbody>
          <tr><td style="padding: 8px; font-weight: bold; width: 40%;">Nombre:</td><td style="padding: 8px;">${formData.nombre}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Teléfono:</td><td style="padding: 8px;">${formData.telefono}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Correo electrónico:</td><td style="padding: 8px;">${formData.email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Servicio:</td><td style="padding: 8px;">${formData.servicio}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Uso del avalúo:</td><td style="padding: 8px;">${formData.uso_avaluo || 'No aplica'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Tipo de propiedad:</td><td style="padding: 8px;">${formData.tipo_propiedad}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Dirección:</td><td style="padding: 8px;">${formData.direccion_calle} #${formData.direccion_numero}, Col. ${formData.direccion_colonia}, ${formData.direccion_ciudad}, ${formData.direccion_estado}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">m² Terreno:</td><td style="padding: 8px;">${formData.m2_terreno || 'No especificado'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">m² Construcción:</td><td style="padding: 8px;">${formData.m2_construccion || 'No especificado'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Notas adicionales:</td><td style="padding: 8px;">${formData.notas || 'Sin notas'}</td></tr>
        </tbody>
      </table>
      <p style="text-align: center;">En breve uno de nuestros asesores se pondrá en contacto contigo.</p>
      <hr>
      <p style="font-size: 0.9em; color: #555; text-align: center;">Este correo es una confirmación automática. Si tienes dudas, responde a este mensaje.</p>
      <p style="font-size: 0.9em; color: #555; text-align: center;">Valura.mx</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: formData.email,
    subject: `Confirmación de solicitud - Valura.mx`,
    html: confirmationTemplate
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo de confirmación enviado con éxito.');
    res.status(200).send('Cotización enviada. ¡Gracias!');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).send('Error al enviar la cotización. Inténtalo de nuevo más tarde.');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
