<?php
$name = $_POST['name'];
$visitor_email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];
$phone = $_POST['phone'];

$email_from = 'info@metal-4construction.com';

$email_subject = 'Ново Запитване';

$email_body = "Име и Фамилия: $name.\n".
              "Имейл на клиента: $visitor_email.\n".
              "Телефонен номер: $phone.\n".
              "Тема: $subject.\n".
              "Запитване: $message.\n";

$to = 'velizar.koleshanski@abv.bg';
$headers = "From: $email_from \r\n";
$headers .= "Reply-To: $visitor_email \r\n";

mail($to, $email_subject, $email_body, $headers);
header("Location: contact.html");
exit; // Ensure script execution stops after redirection
?>
