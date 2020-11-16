// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'toq6ejhzg9'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-xmbz3y4p.us.auth0.com',            // Auth0 domain
  clientId: 'uuj6AKzU0Nkw2rUMK7HB826DT39bda37',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
