// Duración en minutos por servicio
const SERVICE_DURATION = {
  "Corte":               30,
  "Barba":               60,
  "Corte + Barba":       60,
  "Corte y Barba":       60,
  "Arreglo de cejas":    30,
  "Tratamiento capilar": 60,
};

function getDuration(service) {
  return (SERVICE_DURATION[service] ?? 60) * 60000; // devuelve milisegundos
}

module.exports = { getDuration, SERVICE_DURATION };
