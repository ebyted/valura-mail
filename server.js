require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

// Configura la API Key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Ruta para manejar el formulario de cotización
app.post('/api/cotizacion', async (req, res) => {
  const formData = req.body;

  // Construye el cuerpo del correo con los datos del formulario
  const emailBody = `
    <h2>Nueva Cotización de Valura.mx</h2>
    <p><strong>Nombre:</strong> ${formData.nombre}</p>
    <p><strong>Teléfono:</strong> ${formData.telefono}</p>
    <p><strong>Correo electrónico:</strong> ${formData.email}</p>
    <p><strong>Servicio:</strong> ${formData.servicio}</p>
    <p><strong>Uso del avalúo:</strong> ${formData.uso_avaluo || 'No aplica'}</p>
    <p><strong>Tipo de propiedad:</strong> ${formData.tipo_propiedad}</p>
    <p><strong>Dirección:</strong> ${formData.direccion_calle} #${formData.direccion_numero}, Col. ${formData.direccion_colonia}, ${formData.direccion_ciudad}, ${formData.direccion_estado}</p>
    <p><strong>m² Terreno:</strong> ${formData.m2_terreno || 'No especificado'}</p>
    <p><strong>m² Construcción:</strong> ${formData.m2_construccion || 'No especificado'}</p>
    <p><strong>Notas adicionales:</strong> ${formData.notas || 'Sin notas'}</p>
  `;

  const msg = {
    to: 'tu-correo-de-recibo@tudominio.com', // Cambia esta dirección por la tuya
    from: 'no-reply@valura.mx', // Debe ser la dirección verificada en SendGrid
    subject: `Nueva Cotización - ${formData.nombre}`,
    html: emailBody,
  };

  try {
    await sgMail.send(msg);
    console.log('Correo enviado con éxito.');
    res.status(200).send('Cotización enviada. ¡Gracias!');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    res.status(500).send('Error al enviar la cotización. Inténtalo de nuevo más tarde.');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
