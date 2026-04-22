const TOKEN_KEY  = "cr_token";
const BARBER_KEY = "cr_barber";

export const saveSession = (token, barber) => {
  localStorage.setItem(TOKEN_KEY,  token);
  localStorage.setItem(BARBER_KEY, JSON.stringify(barber));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(BARBER_KEY);
};

export const getToken   = () => localStorage.getItem(TOKEN_KEY);
export const getBarber  = () => {
  try { return JSON.parse(localStorage.getItem(BARBER_KEY)); } catch { return null; }
};
export const isLoggedIn = () => !!getToken();
