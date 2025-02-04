export  function getDay() {
  const dayOfWeek = [ "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  const today = new Date();
  const day = today.getDay();
    return dayOfWeek[day];
  }

export function getDate(){
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${date}/${month}/${year}`;
}

export function getMonth(){
  const months = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  const today = new Date();
  const month = today.getMonth();
  return months[month];
}

export function getFullYear(){
  const today = new Date();
  const year = today.getFullYear();
  return year;
}