# aws-client-sign
Helps with generating signed headers for aws v4 signatures.

This project is used to help SPAs communicate with APIGateway, or other AWS services from the client.

## NOTE
You should not embed long term aws credentials in your client side applications.  This signing mechanism should utilize
only temporary credentials, such as Federated Tokens embedded into your sessions after authentication.
