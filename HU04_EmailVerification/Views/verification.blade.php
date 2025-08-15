{% load static %}
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Verifica tu cuenta</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 30px;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        h2 {
            color: #2c3e50;
        }

        .code {
            font-size: 24px;
            font-weight: bold;
            color: #3498db;
            background-color: #ecf0f1;
            padding: 10px 20px;
            display: inline-block;
            border-radius: 5px;
            margin: 20px 0;
        }

        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Hola {{ user.first_name }},</h2>
        <p>Gracias por registrarte. Para completar tu registro, ingresa el siguiente código en la página de verificación:</p>

        <p class="code">{{ code }}</p>

        <p>Este código expirará en <strong>10 minutos</strong>.</p>
        <p>Si no solicitaste este correo, puedes ignorarlo.</p>

        <div class="footer">
            <p>— El equipo de {{ settings.APP_NAME }}</p>
        </div>
    </div>
</body>
</html>
