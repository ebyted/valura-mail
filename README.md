# Mail Sender con SendGrid

Este proyecto es un backend en Node.js para enviar correos usando SendGrid. Recibe datos de un formulario y envía un correo con la información.

## Pasos para usar

1. Coloca tu API Key de SendGrid y el correo de destino en el archivo `.env`:

   SENDGRID_API_KEY=SG.tu_clave_API_de_SendGrid
   PORT=3000
   RECIPIENT_EMAIL=tu-correo-de-recibo@tudominio.com

2. Ejecuta el servidor:

   ```powershell
   node server.js
   ```

3. Envía una petición POST a `http://localhost:3000/api/cotizacion` con los datos del formulario.

### Ejemplo de petición con curl

```bash
curl -X POST http://localhost:3000/api/cotizacion \
   -H "Content-Type: application/json" \
   -d '{
      "nombre": "Juan Pérez",
      "telefono": "5551234567",
      "email": "juan@correo.com",
      "servicio": "Avalúo comercial",
      "uso_avaluo": "Compra",
      "tipo_propiedad": "Casa",
      "direccion_calle": "Av. Reforma",
      "direccion_numero": "123",
      "direccion_colonia": "Centro",
      "direccion_ciudad": "CDMX",
      "direccion_estado": "Ciudad de México",
      "m2_terreno": "200",
      "m2_construccion": "150",
      "notas": "Urgente"
   }'
```

## Seguridad
- No subas el archivo `.env` a repositorios públicos.
- La API Key nunca debe estar en el frontend.

## Dependencias
- express
- body-parser
- @sendgrid/mail
- dotenv
- cors
