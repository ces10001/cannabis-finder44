export interface Deal {
  id: string;
  product: string;
  category: 'flower' | 'vapes' | 'edibles' | 'concentrates' | 'pre-rolls';
  originalPrice: number;
  salePrice: number;
  description: string;
}

export interface Dispensary {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  licenseType: 'medical' | 'recreational' | 'both';
  isOpen: boolean;
  phone: string;
  deals?: Deal[];
}

export const demoDispensaries: Dispensary[] = [
  {
    id: '1',
    name: 'Green Door Dispensary',
    lat: 37.7749,
    lng: -122.4194,
    address: '843 Howard St',
    city: 'San Francisco',
    state: 'CA',
    rating: 4.8,
    reviewCount: 523,
    licenseType: 'recreational',
    isOpen: true,
    phone: '(415) 555-0100',
    deals: [
      { id: 'd1', product: 'Blue Dream 1/8oz', category: 'flower', originalPrice: 45, salePrice: 35, description: '22% THC' },
      { id: 'd2', product: 'Stiiizy Pod', category: 'vapes', originalPrice: 40, salePrice: 30, description: 'Premium cart' }
    ]
  },
  {
    id: '2',
    name: 'Mission Cannabis Club',
    lat: 37.7599,
    lng: -122.4148,
    address: '2441 Mission St',
    city: 'San Francisco',
    state: 'CA',
    rating: 4.6,
    reviewCount: 412,
    licenseType: 'recreational',
    isOpen: true,
    phone: '(415) 555-0101',
    deals: [{ id: 'd3', product: 'Kiva Chocolate', category: 'edibles', originalPrice: 25, salePrice: 18, description: '100mg THC' }]
  },
  {
    id: '3',
    name: 'The Apothecarium',
    lat: 37.7833,
    lng: -122.4167,
    address: '2029 Market St',
    city: 'San Francisco',
    state: 'CA',
    rating: 4.7,
    reviewCount: 689,
    licenseType: 'both',
    isOpen: true,
    phone: '(415) 555-0102',
    deals: [
      { id: 'd4', product: 'Gelato Pre-Roll 3pk', category: 'pre-rolls', originalPrice: 30, salePrice: 22, description: 'Premium' },
      { id: 'd5', product: 'Live Resin Cart', category: 'vapes', originalPrice: 50, salePrice: 40, description: 'Full spectrum' }
    ]
  },
  {
    id: '4',
    name: 'Barbary Coast',
    lat: 37.7955,
    lng: -122.3988,
    address: '952 Mission St',
    city: 'San Francisco',
    state: 'CA',
    rating: 4.5,
    reviewCount: 301,
    licenseType: 'recreational',
    isOpen: false,
    phone: '(415) 555-0103'
  },
  {
    id: '5',
    name: 'SPARC',
    lat: 37.7699,
    lng: -122.4294,
    address: '473 Haight St',
    city: 'San Francisco',
    state: 'CA',
    rating: 4.9,
    reviewCount: 756,
    licenseType: 'both',
    isOpen: true,
    phone: '(415) 555-0104',
    deals: [{ id: 'd6', product: 'Shatter - GDP', category: 'concentrates', originalPrice: 35, salePrice: 25, description: '85% THC' }]
  },
  {
    id: '6',
    name: 'Cookies on the Strip',
    lat: 37.7847,
    lng: -122.4072,
    address: '1543 Fillmore St',
    city: 'San Francisco',
    state: 'CA',
    rating: 4.8,
    reviewCount: 892,
    licenseType: 'recreational',
    isOpen: true,
    phone: '(415) 555-0105',
    deals: [
      { id: 'd7', product: 'Georgia Pie 1/4oz', category: 'flower', originalPrice: 80, salePrice: 65, description: 'Exclusive' },
      { id: 'd8', product: 'Cheetah Piss Vape', category: 'vapes', originalPrice: 45, salePrice: 35, description: 'Premium' }
    ]
  },
  {
    id: '7',
    name: 'Bloom Room',
    lat: 37.7580,
    lng: -122.4375,
    address: '1843 Mission St',
    city: 'San Francisco',
    state: 'CA',
    rating: 4.4,
    reviewCount: 234,
    licenseType: 'medical',
    isOpen: true,
    phone: '(415) 555-0106'
  },
  {
    id: '8',
    name: 'Grassdoor',
    lat: 37.7897,
    lng: -122.4011,
    address: '754 Post St',
    city: 'San Francisco',
    state: 'CA',
    rating: 4.6,
    reviewCount: 445,
    licenseType: 'recreational',
    isOpen: true,
    phone: '(415) 555-0107',
    deals: [{ id: 'd9', product: 'Gummies', category: 'edibles', originalPrice: 22, salePrice: 16, description: '10mg each' }]
  },
  {
    id: '9',
    name: 'Magnolia Wellness',
    lat: 37.7647,
    lng: -122.4477,
    address: '2441 Lombard St',
    city: 'San Francisco',
    state: 'CA',
    rating: 4.7,
    reviewCount: 567,
    licenseType: 'recreational',
    isOpen: false,
    phone: '(415) 555-0108'
  },
  {
    id: '10',
    name: 'Berners on Haight',
    lat: 37.7692,
    lng: -122.4481,
    address: '1634 Haight St',
    city: 'San Francisco',
    state: 'CA',
    rating: 4.9,
    reviewCount: 1023,
    licenseType: 'recreational',
    isOpen: true,
    phone: '(415) 555-0109',
    deals: [
      { id: 'd10', product: 'London Pound Cake', category: 'flower', originalPrice: 55, salePrice: 45, description: 'Premium' },
      { id: 'd11', product: 'Wedding Cake Pre-Rolls', category: 'pre-rolls', originalPrice: 40, salePrice: 30, description: 'Infused' }
    ]
  }
];
