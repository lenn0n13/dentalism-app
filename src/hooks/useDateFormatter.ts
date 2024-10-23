const useDateFormatter = (date: Date) => {
  const dateObj = new Date(date);
  const month = dateObj.getUTCMonth() + 1; // months from 1-12
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  // Using padded values, so that 2023/1/7 becomes 2023/01/07
  const pMonth = month.toString().padStart(2, "0");
  const pDay = day.toString().padStart(2, "0");

  return {
    month,
    day,
    year,
    pMonth,
    pDay
  }
}

export default useDateFormatter;