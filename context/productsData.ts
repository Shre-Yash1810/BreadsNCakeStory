export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Base price for 0.5kg
  image: string;
  images: string[];
  category: 'Birthday' | 'Anniversary' | 'Themed';
}

export const defaultProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Golden Glamour Chocolate Cake',
    description: 'Indulgent Belgian chocolate sponge layers with rich ganache, gold dust, and edible pearls. The ultimate celebratory showstopper.',
    price: 1800,
    image: 'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695668/breads_cakestory/products/cake_birthday_1.jpg',
    images: [
      'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695668/breads_cakestory/products/cake_birthday_1.jpg',
      'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695672/breads_cakestory/products/cake_birthday_3.jpg'
    ],
    category: 'Birthday'
  },
  {
    id: 'prod-2',
    name: 'Berry Macaron Gradient Cake',
    description: 'Whimsical pastel gradients of vanilla buttercream, crowned with gold-brushed macarons, fresh strawberries, and meringue drops.',
    price: 1500,
    image: 'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695670/breads_cakestory/products/cake_birthday_2.jpg',
    images: [
      'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695670/breads_cakestory/products/cake_birthday_2.jpg',
      'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695683/breads_cakestory/products/cake_themed_3.jpg'
    ],
    category: 'Birthday'
  },
  {
    id: 'prod-3',
    name: 'Royal Red Velvet Bloom Cake',
    description: 'Layers of rich crimson cocoa sponge paired with thick cream cheese frosting, decorated with handmade edible red roses and chocolate curls.',
    price: 1950,
    image: 'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695677/breads_cakestory/products/cake_anniversary_2.jpg',
    images: [
      'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695677/breads_cakestory/products/cake_anniversary_2.jpg',
      'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695675/breads_cakestory/products/cake_anniversary_1.jpg'
    ],
    category: 'Anniversary'
  },
  {
    id: 'prod-4',
    name: 'Champagne Gold Rose Cake',
    description: 'Epitome of elegance. Luxurious ivory frosting with shimmering champagne gold leaf flakes and white sugar rose bouquets.',
    price: 2200,
    image: 'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695675/breads_cakestory/products/cake_anniversary_1.jpg',
    images: [
      'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695675/breads_cakestory/products/cake_anniversary_1.jpg',
      'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695683/breads_cakestory/products/cake_themed_3.jpg'
    ],
    category: 'Anniversary'
  },
  {
    id: 'prod-5',
    name: 'Enchanted Forest Bark Cake',
    description: 'Hand-sculpted rustic chocolate bark casing filled with decadent truffle layers, decorated with edible moss and meringue mushrooms.',
    price: 2400,
    image: 'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695679/breads_cakestory/products/cake_themed_1.jpg',
    images: [
      'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695679/breads_cakestory/products/cake_themed_1.jpg',
      'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695668/breads_cakestory/products/cake_birthday_1.jpg'
    ],
    category: 'Themed'
  },
  {
    id: 'prod-6',
    name: 'Galaxy Cosmic Mirror Cake',
    description: 'Flawless glossy mirror glaze reflecting deep cosmos purples and teals, featuring white chocolate planets and hand-painted stardust.',
    price: 2600,
    image: 'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695681/breads_cakestory/products/cake_themed_2.jpg',
    images: ['https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695681/breads_cakestory/products/cake_themed_2.jpg'],
    category: 'Themed'
  },
  {
    id: 'prod-7',
    name: 'Gold Splash Macaron Cake',
    description: 'Modern luxury design with gold drips cascading down smooth vanilla bean frosting, topped with gold leaf macarons and chocolate shards.',
    price: 2100,
    image: 'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695683/breads_cakestory/products/cake_themed_3.jpg',
    images: [
      'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695683/breads_cakestory/products/cake_themed_3.jpg',
      'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695670/breads_cakestory/products/cake_birthday_2.jpg'
    ],
    category: 'Themed'
  },
  {
    id: 'prod-8',
    name: 'Royal Chocolate Truffle Cake',
    description: 'Double-chocolate sponge infused with chocolate liqueur syrup, finished with a dark mirror glaze and luxury truffles.',
    price: 1650,
    image: 'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695672/breads_cakestory/products/cake_birthday_3.jpg',
    images: [
      'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695672/breads_cakestory/products/cake_birthday_3.jpg',
      'https://res.cloudinary.com/oiqh1eqq/image/upload/v1783695668/breads_cakestory/products/cake_birthday_1.jpg'
    ],
    category: 'Birthday'
  }
];
