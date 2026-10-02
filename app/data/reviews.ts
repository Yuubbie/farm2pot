export interface Review {
  name: string;
  text: string;
  source?: string;
}

export const reviews: Review[] = [
  {
    name: "Idy Kabasa",
    text: "Best Nigerian food in Ajah! The jollof rice is always fresh and the portions are generous. Highly recommend Farm2Pot.",
    source: "Google",
  },
  {
    name: "Joy Sunday",
    text: "Ordered the pepper soup and it arrived hot and delicious. Fast delivery and great customer service. Will order again!",
    source: "WhatsApp",
  },
  {
    name: "Janet Okeke",
    text: "The grilled chicken and plantains are amazing. Farm2Pot is my go-to for real Nigerian taste. Open 24/7 which is perfect for late night cravings.",
    source: "Google",
  },
];