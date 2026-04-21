export type ProductCategory = 'Coques' | 'Verres trempés' | 'Chargeurs' | 'Reconditionnés' | 'Accessoires';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  badge?: string;
  stock: number;
  rating: number;
  reviews: number;
}

export const productCategories: ProductCategory[] = ['Coques', 'Verres trempés', 'Chargeurs', 'Reconditionnés', 'Accessoires'];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Coque iPhone 15 Pro Max - Cuir Premium',
    category: 'Coques',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Coque en cuir véritable avec protection renforcée aux coins',
    badge: 'Promo',
    stock: 15,
    rating: 4.8,
    reviews: 42,
  },
  {
    id: 'p2',
    name: 'Verre trempé Samsung Galaxy S24 - 9H',
    category: 'Verres trempés',
    price: 14.99,
    image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Protection écran ultra-résistante, dureté 9H, transparence 99%',
    badge: 'Bestseller',
    stock: 50,
    rating: 4.7,
    reviews: 89,
  },
  {
    id: 'p3',
    name: 'iPhone 13 Reconditionné - 128Go',
    category: 'Reconditionnés',
    price: 449,
    originalPrice: 699,
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Grade A - Batterie neuve, écran parfait, garantie 6 mois',
    badge: 'Eco-responsable',
    stock: 3,
    rating: 4.9,
    reviews: 31,
  },
  {
    id: 'p4',
    name: 'Chargeur MagSafe 15W',
    category: 'Chargeurs',
    price: 34.99,
    image: 'https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Charge rapide sans fil MagSafe compatible iPhone 12 et +',
    stock: 20,
    rating: 4.6,
    reviews: 55,
  },
  {
    id: 'p5',
    name: 'Coque Samsung A54 - Transparente Antichoc',
    category: 'Coques',
    price: 12.99,
    image: 'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'TPU transparent, protection militaire grade, coins renforcés',
    stock: 30,
    rating: 4.5,
    reviews: 28,
  },
  {
    id: 'p6',
    name: 'Samsung Galaxy A53 Reconditionné - 128Go',
    category: 'Reconditionnés',
    price: 279,
    originalPrice: 449,
    image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Grade B - Légères traces d\'usage, batterie 90%+, garantie 3 mois',
    badge: 'Eco',
    stock: 2,
    rating: 4.4,
    reviews: 18,
  },
  {
    id: 'p7',
    name: 'Câble USB-C vers Lightning - Tressé 2m',
    category: 'Accessoires',
    price: 19.99,
    image: 'https://images.pexels.com/photos/4219862/pexels-photo-4219862.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Câble certifié MFi, charge rapide 20W, gaine tressée nylon',
    stock: 40,
    rating: 4.7,
    reviews: 63,
  },
  {
    id: 'p8',
    name: 'Verre trempé iPhone 15 - Full Glue',
    category: 'Verres trempés',
    price: 16.99,
    image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Couverture totale bords courbes, installation facile avec kit',
    badge: 'Nouveau',
    stock: 35,
    rating: 4.8,
    reviews: 47,
  },
];
