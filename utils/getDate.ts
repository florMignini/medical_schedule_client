export  function getDate() {
  const dayOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Sábado"]
    const today = new Date();
    const day = today.getDay();
    const year = today.getFullYear();
    const date = today.getDate();
    return dayOfWeek[day];
  }