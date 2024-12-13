//format date
export const formatDate = (date) => {
  const currentDate = new Date();
  const dateMsg = new Date(date);
  const distanceTime = currentDate - dateMsg;
  const seconds = Math.round(distanceTime / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30);
  const years = Math.round(months / 12);
  if (seconds < 60) {
    return "1 phút";
  } else if (minutes < 60) {
    return `${minutes} phút`;
  } else if (hours < 24) {
    return `${hours} giờ`;
  } else if (days < 30) {
    return `${days} ngày`;
  } else if (months < 12) {
    return `${months} tháng`;
  } else {
    return `${years} năm`;
  }
};
