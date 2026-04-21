export interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
  service: string;
  avatar: string;
}

export const reviews: Review[] = [
  {
    id: 'r1',
    name: 'Marie-Claire D.',
    rating: 5,
    date: '15 mars 2025',
    text: 'Écran remplacé en 25 minutes ! Personnel super professionnel. Mon iPhone ressemble à du neuf. Je recommande vraiment.',
    service: 'Remplacement écran iPhone 13',
    avatar: 'M',
  },
  {
    id: 'r2',
    name: 'Thomas G.',
    rating: 5,
    date: '8 mars 2025',
    text: 'Ouvert le dimanche, c\'est ce qui m\'a convaincu. Réparation rapide et prix honnête. Le technicien a pris le temps de tout expliquer.',
    service: 'Remplacement batterie Samsung S24',
    avatar: 'T',
  },
  {
    id: 'r3',
    name: 'Amina B.',
    rating: 5,
    date: '2 mars 2025',
    text: 'Excellent rapport qualité-prix ! J\'avais peur que ça coûte très cher mais les tarifs sont très raisonnables. Réparation en 30 min.',
    service: 'Connecteur de charge iPhone 12',
    avatar: 'A',
  },
  {
    id: 'r4',
    name: 'Julien P.',
    rating: 4,
    date: '20 fév. 2025',
    text: 'Très bonne expérience globalement. Léger retard sur le délai annoncé mais le résultat est parfait. Mon téléphone fonctionne comme neuf.',
    service: 'Remplacement écran Samsung A54',
    avatar: 'J',
  },
  {
    id: 'r5',
    name: 'Sophie L.',
    rating: 5,
    date: '14 fév. 2025',
    text: 'Boutique propre et accueillante. J\'ai pu suivre la réparation depuis le comptoir. Vraiment transparent et honnête. Merci !',
    service: 'Remplacement caméra iPhone 15',
    avatar: 'S',
  },
  {
    id: 'r6',
    name: 'Karim M.',
    rating: 5,
    date: '5 fév. 2025',
    text: 'Mon Galaxy S24 Ultra est comme neuf. Prise en charge en moins de 5 minutes. Les gars sont des pros. Centre-ville, pratique !',
    service: 'Remplacement écran Galaxy S24 Ultra',
    avatar: 'K',
  },
  {
    id: 'r7',
    name: 'Lucie R.',
    rating: 4,
    date: '28 jan. 2025',
    text: 'Bonne adresse pour réparer son téléphone. Devis gratuit et sans engagement. Personnel sympa qui prend le temps de te conseiller.',
    service: 'Remplacement batterie iPhone 14',
    avatar: 'L',
  },
  {
    id: 'r8',
    name: 'Nicolas F.',
    rating: 5,
    date: '20 jan. 2025',
    text: 'Service parfait ! J\'ai envoyé un message WhatsApp le matin, j\'avais un devis en 10 minutes. Réparation l\'après-midi même.',
    service: 'Remplacement écran Xiaomi Redmi Note 13',
    avatar: 'N',
  },
];

export const averageRating = 4.6;
export const totalReviews = 312;
