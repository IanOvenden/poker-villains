export type Villain = {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
};

export const VILLAINS: Villain[] = [
  { id: "shark", name: "The Shark", emoji: "🃏", tagline: "Cold, calculating, sunglasses" },
  { id: "hustler", name: "The Hustler", emoji: "🎩", tagline: "Slick, old-school gambler" },
  { id: "ghost", name: "The Ghost", emoji: "💀", tagline: "Unpredictable, mysterious" },
  { id: "gunslinger", name: "The Gunslinger", emoji: "🔫", tagline: "Old west card sharp" },
  { id: "viper", name: "The Viper", emoji: "🐍", tagline: "Sneaky, slow burn" },
  { id: "don", name: "The Don", emoji: "👑", tagline: "Mafia boss energy" },
  { id: "fox", name: "The Fox", emoji: "🦊", tagline: "Clever, always one step ahead" },
  { id: "machine", name: "The Machine", emoji: "🤖", tagline: "Emotionless, pure logic" },
  { id: "joker", name: "The Joker", emoji: "🃏", tagline: "Wildcard, unpredictable" },
  { id: "devil", name: "The Devil", emoji: "😈", tagline: "Pure chaos" },
];
