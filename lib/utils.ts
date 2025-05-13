export const FindWeek = (initalDate: Date) => {
    const startdifference = initalDate.getDay() - 1;
    const weekStart = new Date(initalDate.getFullYear(), initalDate.getMonth(),initalDate.getDate() - startdifference);
    
    const enddifference = 7 - initalDate.getDay();
    const weekEnd = new Date(initalDate.getFullYear(), initalDate.getMonth(),initalDate.getDate() + enddifference);
    return({weekmonday: weekStart, weeksunday: weekEnd})
  }