<?php
// Minimal contact handler (optional).
// If your hosting does not support PHP or you prefer a different backend, replace/remove this file.
// Security notes:
// - Validates required fields
// - Basic header injection prevention
// - Sends email via mail() if configured on hosting

header('Content-Type: text/html; charset=utf-8');

function clean($v) {
  $v = trim((string)$v);
  $v = str_replace(array("\r","\n"), ' ', $v);
  return $v;
}

$required = array('nombre','asunto','telefono','entidad','email','mensaje','acepta');
foreach ($required as $k) {
  if (!isset($_POST[$k]) || trim($_POST[$k]) === '') {
    http_response_code(400);
    echo "Faltan campos obligatorios.";
    exit;
  }
}

$nombre  = clean($_POST['nombre']);
$asunto  = clean($_POST['asunto']);
$telefono= clean($_POST['telefono']);
$entidad = clean($_POST['entidad']);
$email   = clean($_POST['email']);
$mensaje = trim((string)$_POST['mensaje']);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo "Email inválido.";
  exit;
}

// Adjust destination email as needed:
$to = "atencionalcliente@sjerp.com";
$subject = "[Web SJT] " . $asunto;

$body = "Nuevo mensaje desde el formulario web:\n\n";
$body .= "Nombre: $nombre\n";
$body .= "Teléfono: $telefono\n";
$body .= "Entidad: $entidad\n";
$body .= "Email: $email\n\n";
$body .= "Mensaje:\n$mensaje\n";

$headers = "From: no-reply@sjterp.com\r\n";
$headers .= "Reply-To: $email\r\n";

$sent = @mail($to, $subject, $body, $headers);

// Always redirect back to home section (even if mail() isn't configured).
$redirect = "index.html#contacto";
if ($sent) {
  header("Location: $redirect");
  exit;
}

http_response_code(200);
echo "Mensaje recibido. Si el servidor está configurado para enviar correos, será entregado al equipo. Puedes cerrar esta pestaña y volver a la web.";
?>