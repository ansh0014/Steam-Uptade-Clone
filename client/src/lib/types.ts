export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Screenshot {
  id: string;
  gameId: string;
  url: string;
}

export interface SystemRequirements {
  minimum: {
    OS: string;
    Processor: string;
    Memory: string;
    Graphics: string;
    Storage: string;
  };
  recommended: {
    OS: string;
    Processor: string;
    Memory: string;
    Graphics: string;
    Storage: string;
  };
}

export interface Game {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  headerImage: string;
  price: number;
  originalPrice: number;
  discount: number;
  releaseDate: string;
  developer: string;
  publisher: string;
  languages: string;
  isFeatured: boolean;
  isSpecialOffer: boolean;
  isNewRelease: boolean;
  isPopular: boolean;
  categories: Category[];
  screenshots?: Screenshot[];
  systemRequirements?: SystemRequirements;
}

export interface CartItem extends Game {
  quantity: number;
}

export interface UserLibrary {
  id: string;
  gameId: string;
  userId: string;
  purchaseDate: string;
  Game?: Game;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'netbanking' | 'upi';
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  createdAt: string;
  games: Game[];
}
