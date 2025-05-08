export const formatTime = (time) => {
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr);
    const period = hour >= 12 ? "م" : "ص";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${period}`;
  };
  
  export const getArabicDay = (engDay) => {
    const map = {
      SUNDAY: "الأحد",
      MONDAY: "الإثنين",
      TUESDAY: "الثلاثاء",
      WEDNESDAY: "الأربعاء",
      THURSDAY : "الخميس",
      FRIDAY: "الجمعة",
      SATURDAY: "السبت"
    };
    return map[engDay] || engDay;
  };
  
  export const formatSchedule = (scheduleArr) => {
    return scheduleArr.map(({ dayOfWeek, startTime, endTime }) => {
      const arabicDay = getArabicDay(dayOfWeek);
      return `${arabicDay} | ${formatTime(startTime)} - ${formatTime(endTime)}`;
    }).join("، ");
  };

  
  