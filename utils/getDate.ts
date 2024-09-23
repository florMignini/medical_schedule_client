export  function getDay() {
  const dayOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Sábado"]
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