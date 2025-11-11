function isoTimeFormat(dateString) {
  const date = new Date(dateString);
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // convert 0 -> 12, 13 -> 1, etc.
  return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
}

export default isoTimeFormat