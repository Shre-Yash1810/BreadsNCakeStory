export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Base price for 0.5kg
  image: string;
  images: string[];
  category: 'Birthday' | 'Anniversary' | 'Themed';
  rating: number;
  reviewsCount: number;
}

export const defaultProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Golden Glamour Chocolate Cake',
    description: 'Indulgent Belgian chocolate sponge layers with rich ganache, gold dust, and edible pearls. The ultimate celebratory showstopper.',
    price: 1800,
    image: '/images/cake_birthday_1.png',
    images: ['/images/cake_birthday_1.png', '/images/cake_birthday_3.png'],
    category: 'Birthday',
    rating: 4.9,
    reviewsCount: 42
  },
  {
    id: 'prod-2',
    name: 'Berry Macaron Gradient Cake',
    description: 'Whimsical pastel gradients of vanilla buttercream, crowned with gold-brushed macarons, fresh strawberries, and meringue drops.',
    price: 1500,
    image: '/images/cake_birthday_2.png',
    images: ['/images/cake_birthday_2.png', '/images/cake_themed_3.png'],
    category: 'Birthday',
    rating: 4.8,
    reviewsCount: 38
  },
  {
    id: 'prod-3',
    name: 'Royal Red Velvet Bloom Cake',
    description: 'Layers of rich crimson cocoa sponge paired with thick cream cheese frosting, decorated with handmade edible red roses and chocolate curls.',
    price: 1950,
    image: '/images/cake_anniversary_2.png',
    images: ['/images/cake_anniversary_2.png', '/images/cake_anniversary_1.png'],
    category: 'Anniversary',
    rating: 5.0,
    reviewsCount: 57
  },
  {
    id: 'prod-4',
    name: 'Champagne Gold Rose Cake',
    description: 'Epitome of elegance. Luxurious ivory frosting with shimmering champagne gold leaf flakes and white sugar rose bouquets.',
    price: 2200,
    image: '/images/cake_anniversary_1.png',
    images: ['/images/cake_anniversary_1.png', '/images/cake_themed_3.png'],
    category: 'Anniversary',
    rating: 4.9,
    reviewsCount: 29
  },
  {
    id: 'prod-5',
    name: 'Enchanted Forest Bark Cake',
    description: 'Hand-sculpted rustic chocolate bark casing filled with decadent truffle layers, decorated with edible moss and meringue mushrooms.',
    price: 2400,
    image: '/images/cake_themed_1.png',
    images: ['/images/cake_themed_1.png', '/images/cake_birthday_1.png'],
    category: 'Themed',
    rating: 4.7,
    reviewsCount: 18
  },
  {
    id: 'prod-6',
    name: 'Galaxy Cosmic Mirror Cake',
    description: 'Flawless glossy mirror glaze reflecting deep cosmos purples and teals, featuring white chocolate planets and hand-painted stardust.',
    price: 2600,
    image: '/images/cake_themed_2.png',
    images: ['/images/cake_themed_2.png'],
    category: 'Themed',
    rating: 5.0,
    reviewsCount: 24
  },
  {
    id: 'prod-7',
    name: 'Gold Splash Macaron Cake',
    description: 'Modern luxury design with gold drips cascading down smooth vanilla bean frosting, topped with gold leaf macarons and chocolate shards.',
    price: 2100,
    image: '/images/cake_themed_3.png',
    images: ['/images/cake_themed_3.png', '/images/cake_birthday_2.png'],
    category: 'Themed',
    rating: 4.9,
    reviewsCount: 31
  },
  {
    id: 'prod-8',
    name: 'Royal Chocolate Truffle Cake',
    description: 'Double-chocolate sponge infused with chocolate liqueur syrup, finished with a dark mirror glaze and luxury truffles.',
    price: 1650,
    image: '/images/cake_birthday_3.png',
    images: ['/images/cake_birthday_3.png', '/images/cake_birthday_1.png'],
    category: 'Birthday',
    rating: 4.8,
    reviewsCount: 49
  }
];
