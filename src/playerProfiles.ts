export interface PlayerProfile {
  name: string;
  handicap: number;
}

const STORAGE_KEY = "hector-players";

export function getProfiles(): PlayerProfile[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveProfile(profile: PlayerProfile): void {
  const profiles = getProfiles();
  const index = profiles.findIndex(p => p.name === profile.name);
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export function deleteProfile(name: string): void {
  const profiles = getProfiles().filter(p => p.name !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}
