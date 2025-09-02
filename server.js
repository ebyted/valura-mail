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
  },
  tls: {
    rejectUnauthorized: false
  }
});

const app = express();
const port = process.env.PORT || 3015;
// Función para acentuar correctamente los nombres de servicio
function acentuarServicio(servicio) {
  let s = (servicio || '').toLowerCase();
  s = s.replace(/estimacion/g, 'estimación');
  s = s.replace(/avaluo/g, 'avalúo');
  s = s.replace(/inspeccion/g, 'inspección');
  // Si el original tenía mayúsculas, respétalas en el resultado
  // (opcional, para mantener formato)
  // Si quieres que la primera letra sea mayúscula:
  if (servicio && servicio[0] === servicio[0].toUpperCase()) {
    s = s.charAt(0).toUpperCase() + s.slice(1);
  }
  return s;
}

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:3015', 'https://valura.mx', 'https://www.valura.mx', 'http://valura-homepage'],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// Ruta para manejar el formulario de cotización
// Endpoint simple para prueba
app.get('/api/hola', (req, res) => {
  res.json({ mensaje: 'Hola mundo' });
});
app.post('/api/cotizacion', async (req, res) => {
  const formData = req.body;
  console.log('Valor recibido en servicio:', formData.servicio);
  const servicioNombre = acentuarServicio(formData.servicio_label || formData.servicio);

  // Template formal y elegante para el correo de confirmación
  const confirmationTemplate = `
    <div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: auto;">
      <h2 style="color: #005baa; text-align: center;">¡Tu solicitud está en proceso! – Valura</h2>
      <p>Hola sr <strong>${formData.nombre}</strong>,</p>
      <p>Gracias por llenar el formulario.<br>
      Ya recibimos tu información y estamos preparando tu propuesta económica para el servicio de <strong>${servicioNombre}</strong>.<br>
      Te enviaremos los detalles para que puedas revisarlos y avanzar al siguiente paso.<br>
      Queremos que el proceso sea claro, rápido y sin complicaciones para ti.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tbody>
          <tr><td style="padding: 8px; font-weight: bold; width: 40%;">Nombre:</td><td style="padding: 8px;">${formData.nombre}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Teléfono:</td><td style="padding: 8px;">${formData.telefono}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Correo electrónico:</td><td style="padding: 8px;">${formData.email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Servicio:</td><td style="padding: 8px;">${acentuarServicio(formData.servicio)}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Uso del avalúo:</td><td style="padding: 8px;">${formData.uso_avaluo || 'No aplica'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Tipo de propiedad:</td><td style="padding: 8px;">${formData.tipo_propiedad}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Dirección:</td><td style="padding: 8px;">${formData.direccion_calle} #${formData.direccion_numero}, Col. ${formData.direccion_colonia}, ${formData.direccion_ciudad}, ${formData.direccion_estado}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">m² Terreno:</td><td style="padding: 8px;">${formData.m2_terreno || 'No especificado'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">m² Construcción:</td><td style="padding: 8px;">${formData.m2_construccion || 'No especificado'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Notas adicionales:</td><td style="padding: 8px;">${formData.notas || 'Sin notas'}</td></tr>
        </tbody>
      </table>
      <p>Un saludo,<br>Equipo Valura</p>
      <p style="font-size: 0.9em; color: #555; text-align: center;">Claridad, valor y forma en Valura.mx</p>
      <hr>
      <p style="font-size: 0.9em; color: #555; text-align: center;">Este correo es una confirmación automática. Si tienes dudas, responde a este mensaje.</p>
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
    console.log('Correo de confirmación enviado exitosamente.');
    res.status(200).send('Cotización enviada. ¡Gracias!');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).send('Error al enviar la cotización. Inténtalo de nuevo más tarde.');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
