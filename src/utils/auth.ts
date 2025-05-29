export function isTokenValido(token: string | null): boolean {
  if (!token) return false;

  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const exp = decodedPayload.exp;

    if (!exp) return false;

    const agora = Math.floor(Date.now() / 1000); // timestamp atual em segundos
    return exp > agora;
  } catch (e) {
    return false;
  }
}
