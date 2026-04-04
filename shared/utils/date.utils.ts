export function calculateAge(birthday: string, deathday?: string | null): number {
  const birth = new Date(birthday);
  const end = deathday ? new Date(deathday) : new Date();

  let age = end.getFullYear() - birth.getFullYear();
  const m = end.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}