export type Brand = 'iPhone' | 'Samsung' | 'Xiaomi' | 'Huawei' | 'OnePlus' | 'Google';
export type RepairType = 'Écran' | 'Batterie' | 'Connecteur' | 'Caméra' | 'Coque' | 'Autre';

export interface Service {
  id: string;
  brand: Brand;
  model: string;
  repairType: RepairType;
  priceFrom: number;
  duration: string;
  description: string;
  popular?: boolean;
}

export const brands: Brand[] = ['iPhone', 'Samsung', 'Xiaomi', 'Huawei', 'OnePlus', 'Google'];

export const repairTypes: RepairType[] = ['Écran', 'Batterie', 'Connecteur', 'Caméra', 'Coque', 'Autre'];

export const services: Service[] = [
  { id: 's1', brand: 'iPhone', model: 'iPhone 15 Pro Max', repairType: 'Écran', priceFrom: 199, duration: '30 min', description: 'Remplacement écran OLED original', popular: true },
  { id: 's2', brand: 'iPhone', model: 'iPhone 15 Pro', repairType: 'Écran', priceFrom: 179, duration: '30 min', description: 'Remplacement écran OLED original' },
  { id: 's3', brand: 'iPhone', model: 'iPhone 15', repairType: 'Écran', priceFrom: 149, duration: '30 min', description: 'Remplacement écran OLED original' },
  { id: 's4', brand: 'iPhone', model: 'iPhone 14 Pro', repairType: 'Écran', priceFrom: 149, duration: '30 min', description: 'Remplacement écran OLED original' },
  { id: 's5', brand: 'iPhone', model: 'iPhone 13', repairType: 'Écran', priceFrom: 99, duration: '30 min', description: 'Remplacement écran OLED original', popular: true },
  { id: 's6', brand: 'iPhone', model: 'iPhone 12', repairType: 'Écran', priceFrom: 89, duration: '30 min', description: 'Remplacement écran OLED original' },
  { id: 's7', brand: 'iPhone', model: 'iPhone 15 Pro', repairType: 'Batterie', priceFrom: 69, duration: '20 min', description: 'Remplacement batterie haute capacité' },
  { id: 's8', brand: 'iPhone', model: 'iPhone 13', repairType: 'Batterie', priceFrom: 59, duration: '20 min', description: 'Remplacement batterie haute capacité' },
  { id: 's9', brand: 'iPhone', model: 'iPhone 12', repairType: 'Batterie', priceFrom: 49, duration: '20 min', description: 'Remplacement batterie haute capacité' },
  { id: 's10', brand: 'iPhone', model: 'iPhone 13', repairType: 'Connecteur', priceFrom: 79, duration: '45 min', description: 'Remplacement connecteur Lightning/USB-C' },
  { id: 's11', brand: 'iPhone', model: 'iPhone 15', repairType: 'Caméra', priceFrom: 119, duration: '45 min', description: 'Remplacement module caméra arrière' },
  { id: 's12', brand: 'Samsung', model: 'Galaxy S24 Ultra', repairType: 'Écran', priceFrom: 229, duration: '45 min', description: 'Remplacement écran AMOLED original', popular: true },
  { id: 's13', brand: 'Samsung', model: 'Galaxy S24', repairType: 'Écran', priceFrom: 149, duration: '45 min', description: 'Remplacement écran AMOLED original' },
  { id: 's14', brand: 'Samsung', model: 'Galaxy A54', repairType: 'Écran', priceFrom: 89, duration: '30 min', description: 'Remplacement écran Super AMOLED' },
  { id: 's15', brand: 'Samsung', model: 'Galaxy S24 Ultra', repairType: 'Batterie', priceFrom: 79, duration: '30 min', description: 'Remplacement batterie haute performance' },
  { id: 's16', brand: 'Samsung', model: 'Galaxy A54', repairType: 'Batterie', priceFrom: 49, duration: '20 min', description: 'Remplacement batterie' },
  { id: 's17', brand: 'Xiaomi', model: 'Redmi Note 13 Pro', repairType: 'Écran', priceFrom: 79, duration: '30 min', description: 'Remplacement écran AMOLED' },
  { id: 's18', brand: 'Xiaomi', model: 'Mi 13', repairType: 'Écran', priceFrom: 99, duration: '45 min', description: 'Remplacement écran AMOLED' },
  { id: 's19', brand: 'Xiaomi', model: 'Redmi Note 13', repairType: 'Batterie', priceFrom: 45, duration: '20 min', description: 'Remplacement batterie' },
  { id: 's20', brand: 'Huawei', model: 'P60 Pro', repairType: 'Écran', priceFrom: 149, duration: '45 min', description: 'Remplacement écran OLED' },
  { id: 's21', brand: 'Huawei', model: 'Nova 11', repairType: 'Batterie', priceFrom: 55, duration: '20 min', description: 'Remplacement batterie' },
  { id: 's22', brand: 'OnePlus', model: 'OnePlus 12', repairType: 'Écran', priceFrom: 139, duration: '45 min', description: 'Remplacement écran AMOLED' },
  { id: 's23', brand: 'Google', model: 'Pixel 8 Pro', repairType: 'Écran', priceFrom: 159, duration: '45 min', description: 'Remplacement écran LTPO OLED' },
  { id: 's24', brand: 'Google', model: 'Pixel 8', repairType: 'Batterie', priceFrom: 65, duration: '25 min', description: 'Remplacement batterie' },
];

export const getModelsForBrand = (brand: Brand): string[] => {
  return Array.from(new Set(services.filter(s => s.brand === brand).map(s => s.model)));
};

export const getServicesFiltered = (brand?: Brand, model?: string, repairType?: RepairType): Service[] => {
  return services.filter(s => {
    if (brand && s.brand !== brand) return false;
    if (model && s.model !== model) return false;
    if (repairType && s.repairType !== repairType) return false;
    return true;
  });
};
