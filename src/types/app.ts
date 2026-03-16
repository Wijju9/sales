import type {
  CSSProperties,
  ChangeEvent,
  FocusEvent,
  FormEvent,
  MouseEvent,
  ReactNode,
} from "react";

/* ══════════════════════════════════════════════════════════
   TYPES & INTERFACES
══════════════════════════════════════════════════════════ */
export type Page = "home" | "cart" | "product" | "success" | "invoice";
export type ModalType = "login" | "register" | "payment" | null;
export type ToastType = "success" | "danger" | "warning" | "info";
export type ButtonVariant =
  | "brand"
  | "outline-brand"
  | "outline-secondary"
  | "outline-success"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark";
export type ButtonSize = "sm" | "lg" | "";

export interface IUser {
  Id: number | null;
  Name: string;
  Email: string;
  Password: string;
  Phone: string;
  Address: string;
}

export interface IProductImage {
  Id: number;
  Gradient: string;
  Label: string;
  Zoom: number;
  Rotate: number;
}

export interface IProductSpec {
  Key: string;
  Value: string;
}

export interface IProductReview {
  Id: number;
  Author: string;
  Rating: number;
  Comment: string;
  Date: string;
  Verified: boolean;
}

export interface IProduct {
  Id: number;
  Name: string;
  Price: number;
  OriginalPrice?: number;
  Description: string;
  LongDescription: string;
  Emoji: string;
  Category: string;
  Stock: number;
  Rating: number;
  ReviewCount: number;
  Specs: IProductSpec[];
  Reviews: IProductReview[];
  Images: IProductImage[];
  Badge?: string;
}

export interface ICartItem {
  Id: number;
  Product: IProduct;
  Quantity: number;
}

export interface IOrder {
  Id: string;
  User: IUser;
  Items: ICartItem[];
  Total: number;
  Tax: number;
  Status: string;
  CreatedAt: Date;
}

export interface IPayment {
  Id: string | null;
  OrderId: string | null;
  CardNumber: string;
  CardHolder: string;
  Expiry: string;
  CVV: string;
  Amount: number;
}

export interface IToast {
  id: number;
  msg: string;
  type: ToastType;
}

/* ── Context types ──────────────────────────────────────── */
export interface IThemeCtx {
  dark: boolean;
  toggle: () => void;
}

export interface IAuthCtx {
  user: IUser | null;
  login: (c: { Email: string; Password: string }) => { success: boolean; error?: string };
  register: (d: IUser) => { success: boolean; error?: string };
  logout: () => void;
}

export interface ICartCtx {
  items: ICartItem[];
  addItem: (p: IProduct) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  total: number;
  count: number;
}

export interface IAppCtx {
  page: Page;
  navigate: (p: Page) => void;
  modal: ModalType;
  openModal: (m: NonNullable<ModalType>) => void;
  closeModal: () => void;
  order: IOrder | null;
  setOrder: (o: IOrder) => void;
  toasts: IToast[];
  showToast: (msg: string, type?: ToastType) => void;
  selectedProduct: IProduct | null;
  viewProduct: (p: IProduct) => void;
}

/* ── useForm types ──────────────────────────────────────── */
export type FieldValues = Record<string, string | boolean | number>;

export interface ValidationRule<T extends FieldValues = FieldValues> {
  required?: boolean | string;
  minLength?: { value: number; message?: string };
  maxLength?: { value: number; message?: string };
  pattern?: { value: RegExp; message?: string };
  validate?: (value: string, allValues: T) => boolean | string;
}

export type ValidationRules<T extends FieldValues> = Partial<
  Record<keyof T, ValidationRule<T>>
>;

export interface RegisterReturn {
  name: string;
  value: string | boolean | number;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onBlur: (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
}

export interface UseFormReturn<T extends FieldValues> {
  register: (name: keyof T) => RegisterReturn;
  handleSubmit: (onSubmit: (data: T) => void | Promise<void>) => (e?: FormEvent) => void;
  errors: Partial<Record<keyof T, string>>;
  values: T;
  reset: (nextValues?: Partial<T>) => void;
  isSubmitting: boolean;
  setFieldValue: (name: keyof T, value: string) => void;
}

/* ── Component props ────────────────────────────────────── */
export interface AppInputProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  register?: (name: string) => RegisterReturn;
  error?: string;
  icon?: string;
  hint?: string;
  maxLength?: number;
  inputMode?: "text" | "numeric" | "decimal" | "email" | "tel" | "search" | "url";
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}

export interface AppButtonProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: string;
  iconEnd?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  style?: CSSProperties;
}

export interface AppModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: string;
  footer?: ReactNode;
}

export interface AuthFormProps {
  onSwitch: () => void;
}

export interface ProductCardProps {
  product: IProduct;
}


/* ══════════════════════════════════════════════════════════
   MODELS
══════════════════════════════════════════════════════════ */
export class UserModel implements IUser {
  Id: number | null;
  Name: string;
  Email: string;
  Password: string;
  Phone: string;
  Address: string;

  constructor({ Id = null, Name = "", Email = "", Password = "", Phone = "", Address = "" }: Partial<IUser> = {}) {
    this.Id = Id ?? null;
    this.Name = Name;
    this.Email = Email;
    this.Password = Password;
    this.Phone = Phone;
    this.Address = Address;
  }
}

export class ProductModel implements IProduct {
  Id: number;
  Name: string;
  Price: number;
  OriginalPrice?: number;
  Description: string;
  LongDescription: string;
  Emoji: string;
  Category: string;
  Stock: number;
  Rating: number;
  ReviewCount: number;
  Specs: IProductSpec[];
  Reviews: IProductReview[];
  Images: IProductImage[];
  Badge?: string;

  constructor(p: IProduct) {
    this.Id = p.Id;
    this.Name = p.Name;
    this.Price = p.Price;
    this.OriginalPrice = p.OriginalPrice;
    this.Description = p.Description;
    this.LongDescription = p.LongDescription;
    this.Emoji = p.Emoji;
    this.Category = p.Category;
    this.Stock = p.Stock;
    this.Rating = p.Rating;
    this.ReviewCount = p.ReviewCount;
    this.Specs = p.Specs;
    this.Reviews = p.Reviews;
    this.Images = p.Images;
    this.Badge = p.Badge;
  }
}

export class CartItemModel implements ICartItem {
  Id: number;
  Product: IProduct;
  Quantity: number;

  constructor({ Id, Product, Quantity = 1 }: ICartItem) {
    this.Id = Id;
    this.Product = Product;
    this.Quantity = Quantity;
  }
}

export class OrderModel implements IOrder {
  Id: string;
  User: IUser;
  Items: ICartItem[];
  Total: number;
  Tax: number;
  Status: string;
  CreatedAt: Date;

  constructor({ Id, User, Items = [], Total = 0, Tax = 0, Status = "Confirmed", CreatedAt = new Date() }: IOrder) {
    this.Id = Id;
    this.User = User;
    this.Items = Items;
    this.Total = Total;
    this.Tax = Tax;
    this.Status = Status;
    this.CreatedAt = CreatedAt;
  }
}

export class PaymentModel implements IPayment {
  Id: string | null;
  OrderId: string | null;
  CardNumber: string;
  CardHolder: string;
  Expiry: string;
  CVV: string;
  Amount: number;

  constructor({ Id = null, OrderId = null, CardNumber = "", CardHolder = "", Expiry = "", CVV = "", Amount = 0 }: Partial<IPayment> = {}) {
    this.Id = Id;
    this.OrderId = OrderId;
    this.CardNumber = CardNumber;
    this.CardHolder = CardHolder;
    this.Expiry = Expiry;
    this.CVV = CVV;
    this.Amount = Amount;
  }
}

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
export const GRADIENTS: string[] = [
  "135deg,#667eea,#764ba2","135deg,#f093fb,#f5576c","135deg,#4facfe,#00f2fe",
  "135deg,#43e97b,#38f9d7","135deg,#fa709a,#fee140","135deg,#a18cd1,#fbc2eb",
  "135deg,#fccb90,#d57eeb","135deg,#a1c4fd,#c2e9fb","135deg,#fd7043,#ffb74d",
  "135deg,#66bb6a,#43a047","135deg,#42a5f5,#1e88e5","135deg,#ab47bc,#8e24aa",
];

export function makeImages(productId: number, _emoji: string): IProductImage[] {
  const base = productId % GRADIENTS.length;
  const angles = ["135deg", "45deg", "225deg", "90deg", "180deg"];
  const labels = ["Front View", "Side View", "Detail Shot", "Lifestyle", "Package"];
  const zooms = [1, 1.15, 1.3, 1.1, 1.0];
  const rotates = [0, 8, -5, 3, -2];
  return Array.from({ length: 5 }, (_, i) => {
    const g = GRADIENTS[(base + i) % GRADIENTS.length];
    const parts = g.split(",");
    return {
      Id: i,
      Gradient: `${angles[i]},${parts.slice(1).join(",")}`,
      Label: labels[i],
      Zoom: zooms[i],
      Rotate: rotates[i],
    };
  });
}

export function makeSpecs(category: string): IProductSpec[] {
  const maps: Record<string, IProductSpec[]> = {
    Electronics: [
      { Key: "Warranty",      Value: "2 Years" },
      { Key: "Connectivity",  Value: "Bluetooth 5.3 / USB-C" },
      { Key: "Battery",       Value: "Up to 30 hours" },
      { Key: "Weight",        Value: "250g" },
      { Key: "Colors",        Value: "Midnight Black, Pearl White, Indigo" },
      { Key: "In the Box",    Value: "Device, Cable, Manual, Carry Case" },
    ],
    Fashion: [
      { Key: "Material",      Value: "Premium full-grain leather / breathable mesh" },
      { Key: "Sizes",         Value: "XS · S · M · L · XL · XXL" },
      { Key: "Care",          Value: "Wipe clean with damp cloth" },
      { Key: "Origin",        Value: "Crafted in Italy" },
      { Key: "Certification", Value: "OEKO-TEX Standard 100" },
      { Key: "Packaging",     Value: "Recycled gift box" },
    ],
    Home: [
      { Key: "Dimensions",    Value: "28 × 18 × 22 cm" },
      { Key: "Material",      Value: "BPA-free stainless steel" },
      { Key: "Capacity",      Value: "1.5 litres" },
      { Key: "Power",         Value: "1200W / 220-240V" },
      { Key: "Certification", Value: "CE · RoHS · FCC" },
      { Key: "In the Box",    Value: "Unit, power adapter, guide" },
    ],
    Sports: [
      { Key: "Material",      Value: "Natural rubber + cork composite" },
      { Key: "Dimensions",    Value: "183 × 61 cm" },
      { Key: "Thickness",     Value: "6mm" },
      { Key: "Weight",        Value: "1.8kg" },
      { Key: "Certification", Value: "Eco-certified, non-toxic" },
      { Key: "Includes",      Value: "Carry strap, cleaning spray" },
    ],
    Books: [
      { Key: "Format",        Value: "Hardcover + eBook bundle" },
      { Key: "Pages",         Value: "320–480 per title" },
      { Key: "Language",      Value: "English" },
      { Key: "Publisher",     Value: "Penguin Classics / HarperCollins" },
      { Key: "Edition",       Value: "2025 Collector's Edition" },
      { Key: "Includes",      Value: "Bookmarks, reading journal" },
    ],
  };
  return maps[category] ?? maps.Electronics;
}

export function makeReviews(productId: number): IProductReview[] {
  const pool: IProductReview[] = [
    { Id:1, Author:"Sophia M.",    Rating:5, Comment:"Absolutely love this product! Quality exceeded my expectations. Fast delivery too.", Date:"Feb 28, 2026", Verified:true  },
    { Id:2, Author:"James T.",     Rating:4, Comment:"Great value for the price. Setup was straightforward and it works exactly as described.",  Date:"Feb 20, 2026", Verified:true  },
    { Id:3, Author:"Aisha K.",     Rating:5, Comment:"Bought this as a gift and the recipient was thrilled. Premium feel, beautiful packaging.", Date:"Feb 12, 2026", Verified:false },
    { Id:4, Author:"Luca R.",      Rating:3, Comment:"Good product overall but the color was slightly different from the photos. Still happy with it.", Date:"Jan 31, 2026", Verified:true  },
    { Id:5, Author:"Priya S.",     Rating:5, Comment:"Best purchase I've made this year. Fast shipping, exactly as described, amazing quality!", Date:"Jan 22, 2026", Verified:true  },
    { Id:6, Author:"Oliver H.",    Rating:4, Comment:"Solid build quality. Had a minor issue with setup but customer support resolved it quickly.", Date:"Jan 15, 2026", Verified:true  },
  ];
  return pool.slice(0, 3 + (productId % 3));
}

/* ══════════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════════ */
export const PRODUCTS: IProduct[] = [
  { Id:1,  Name:"Wireless Headphones",  Price:79.99,  OriginalPrice:119.99, Description:"Premium ANC, 30hr battery, Hi-Res Audio certified",     LongDescription:"Immerse yourself in studio-quality sound with our flagship Wireless Headphones. Featuring Adaptive Active Noise Cancellation that learns your surroundings, a 30-hour battery life, and LDAC Hi-Res Wireless audio transmission, every note is reproduced with breathtaking fidelity. The memory-foam ear cushions and aircraft-grade aluminum headband ensure all-day comfort, while the foldable design makes them perfect for commuters and travelers alike.", Emoji:"🎧", Category:"Electronics", Stock:15, Rating:4.8, ReviewCount:312, Badge:"Best Seller", Specs:makeSpecs("Electronics"), Reviews:makeReviews(1), Images:makeImages(1,"🎧") },
  { Id:2,  Name:"Smart Watch Pro",       Price:199.99, OriginalPrice:249.99, Description:"ECG, GPS, SpO2 monitor — 7-day battery",                LongDescription:"Take control of your health with the Smart Watch Pro. Its medical-grade ECG sensor, continuous SpO2 monitoring, and always-on GPS give you insights once reserved for clinical settings. The sapphire-crystal display is readable in direct sunlight, while the titanium case and 5ATM water resistance mean it keeps up with your most demanding days — and looks stunning doing it.", Emoji:"⌚", Category:"Electronics", Stock:8,  Rating:4.6, ReviewCount:198, Badge:"New",         Specs:makeSpecs("Electronics"), Reviews:makeReviews(2), Images:makeImages(2,"⌚") },
  { Id:3,  Name:"Mechanical Keyboard",   Price:149.99, OriginalPrice:179.99, Description:"RGB backlit, tactile switches, aluminum chassis",        LongDescription:"Engineered for those who demand precision, the Mechanical Keyboard features hot-swappable tactile switches for a satisfying, responsive keypress. The full-aluminium chassis eliminates flex, while per-key RGB with 16.8 million colors and advanced macros make it equally at home for gaming and productivity. USB-C detachable cable included.", Emoji:"⌨️", Category:"Electronics", Stock:20, Rating:4.7, ReviewCount:445, Badge:"Top Rated",   Specs:makeSpecs("Electronics"), Reviews:makeReviews(3), Images:makeImages(3,"⌨️") },
  { Id:4,  Name:"4K Webcam",             Price:129.99, Description:"AI autofocus, dual mic, plug-and-play",                                        LongDescription:"Elevate every video call to broadcast quality with the 4K Webcam. AI-powered autofocus tracks your face in real time, while the dual noise-cancelling microphones ensure crystal-clear audio. The privacy shutter, automatic low-light enhancement, and universal clip mounting make setup effortless on any monitor or tripod. Works plug-and-play on Windows, Mac, and Linux.", Emoji:"📷", Category:"Electronics", Stock:12, Rating:4.5, ReviewCount:167, Specs:makeSpecs("Electronics"), Reviews:makeReviews(4), Images:makeImages(4,"📷") },
  { Id:5,  Name:"Running Sneakers",      Price:89.99,  OriginalPrice:119.99, Description:"Lightweight foam sole, breathable mesh upper",           LongDescription:"Whether you're hitting the track or exploring city streets, the Running Sneakers deliver unmatched comfort with their dual-density CloudFoam midsole and engineered mesh upper. Reflective trim keeps you visible in low light, while the grippy rubber outsole handles wet and dry surfaces with confidence. Vegan-certified materials and recycled lace construction.", Emoji:"👟", Category:"Fashion",     Stock:30, Rating:4.4, ReviewCount:289, Badge:"Sale",        Specs:makeSpecs("Fashion"),     Reviews:makeReviews(5), Images:makeImages(5,"👟") },
  { Id:6,  Name:"Leather Wallet",        Price:49.99,  Description:"Slim RFID-blocking, full-grain leather",                                       LongDescription:"Handcrafted from a single piece of full-grain Italian leather, this slim wallet develops a rich patina over time. The RFID-blocking technology protects your contactless cards from unauthorized scanning, while the minimalist profile fits perfectly in a front pocket. Holds up to 8 cards plus cash — everything you need, nothing you don't.", Emoji:"👜", Category:"Fashion",     Stock:25, Rating:4.3, ReviewCount:134, Specs:makeSpecs("Fashion"),     Reviews:makeReviews(6), Images:makeImages(6,"👜") },
  { Id:7,  Name:"Coffee Maker",          Price:59.99,  OriginalPrice:79.99,  Description:"15-bar pump, brew perfect espresso every time",           LongDescription:"Start every morning with coffeehouse quality at home. The 15-bar Italian pump pressure and pre-infusion technology extract the full flavor spectrum from your beans. The double-wall stainless carafe keeps coffee hot for 2 hours, while the programmable timer means a fresh brew is ready the moment you wake up. Includes a built-in frother for lattes and cappuccinos.", Emoji:"☕", Category:"Home",        Stock:18, Rating:4.6, ReviewCount:223, Badge:"Sale",        Specs:makeSpecs("Home"),        Reviews:makeReviews(7), Images:makeImages(7,"☕") },
  { Id:8,  Name:"Scented Candle Set",    Price:34.99,  Description:"Soy wax, 3 seasonal fragrances, 60hr burn",                                    LongDescription:"Transform any space into a sanctuary with our curated Scented Candle Set. Each candle is hand-poured from 100% natural soy wax with cotton wicks for a clean, even burn and a 60-hour total burn time. The three seasonal fragrances — Warm Amber & Sandalwood, Fresh Eucalyptus & Mint, and Cozy Vanilla & Tobacco — are blended by certified aromatherapists.", Emoji:"🕯️", Category:"Home",        Stock:40, Rating:4.8, ReviewCount:376, Badge:"Popular",     Specs:makeSpecs("Home"),        Reviews:makeReviews(8), Images:makeImages(8,"🕯️") },
  { Id:9,  Name:"Yoga Mat Pro",          Price:39.99,  OriginalPrice:54.99,  Description:"Non-slip cork surface, eco-certified rubber",             LongDescription:"The Yoga Mat Pro combines a premium natural cork surface with an eco-certified natural rubber base for a grip that improves the more you sweat. Alignment lines are laser-engraved directly into the cork, and the 6mm thickness provides joint cushioning without sacrificing floor connection. Antimicrobial and odor-resistant — ready for daily practice.", Emoji:"🧘", Category:"Sports",      Stock:22, Rating:4.5, ReviewCount:189, Specs:makeSpecs("Sports"),      Reviews:makeReviews(9), Images:makeImages(9,"🧘") },
  { Id:10, Name:"Resistance Bands",      Price:24.99,  Description:"Set of 5 graduated resistance levels",                                         LongDescription:"Build strength anywhere with our color-coded Resistance Bands set. Manufactured from natural latex with smooth fabric loops for skin comfort, they range from 5 lbs to 50 lbs across five bands. A compact carry bag and illustrated exercise guide are included. Suitable for rehabilitation, strength training, yoga, and Pilates.", Emoji:"💪", Category:"Sports",      Stock:50, Rating:4.2, ReviewCount:412, Specs:makeSpecs("Sports"),      Reviews:makeReviews(10), Images:makeImages(10,"💪") },
  { Id:11, Name:"Sunglasses UV400",      Price:69.99,  OriginalPrice:89.99,  Description:"Polarized lenses, titanium frame, includes case",         LongDescription:"Frame your world in style with UV400-certified lenses that block 100% of UVA and UVB radiation. The polarized coating eliminates glare from water and roads for sharper contrast and reduced eye fatigue. The ultra-lightweight titanium frame weighs just 18g while providing durability that lasts decades. Includes a premium hard case and microfiber cleaning cloth.", Emoji:"🕶️", Category:"Fashion",     Stock:14, Rating:4.4, ReviewCount:97,  Specs:makeSpecs("Fashion"),     Reviews:makeReviews(11), Images:makeImages(11,"🕶️") },
  { Id:12, Name:"Novel Collection",      Price:29.99,  Description:"5 bestsellers curated by top literary editors",                                 LongDescription:"Curated by our panel of award-winning literary editors, this collection brings together five seminal works that shaped contemporary fiction. Each hardcover edition features an exclusive foreword, critical annotations, and a beautifully designed cover. A reading journal with guided reflection prompts and custom bookmark set are included — perfect for book clubs or solo deep reading.", Emoji:"📚", Category:"Books",       Stock:35, Rating:4.7, ReviewCount:258, Badge:"Staff Pick",  Specs:makeSpecs("Books"),       Reviews:makeReviews(12), Images:makeImages(12,"📚") },
].map((p) => new ProductModel(p as IProduct));
