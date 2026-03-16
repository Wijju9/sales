import {
  createContext,
  useCallback,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";
import type {
  IAppCtx,
  IAuthCtx,
  ICartCtx,
  ICartItem,
  IOrder,
  IProduct,
  IThemeCtx,
  IToast,
  IUser,
  ModalType,
  Page,
  ToastType,
} from "../types/app";
import { CartItemModel, UserModel } from "../types/app";

/* ══════════════════════════════════════════════════════════
   CONTEXTS
══════════════════════════════════════════════════════════ */
const ThemeCtx = createContext<IThemeCtx | null>(null);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [dark, setDark] = useState<boolean>(false);

  return (
    <ThemeCtx.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      {children}
    </ThemeCtx.Provider>
  );
};

export const useTheme = (): IThemeCtx => {
  const c = useContext(ThemeCtx);
  if (!c) throw new Error("useTheme");
  return c;
};

const AuthCtx = createContext<IAuthCtx | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [users, setUsers] = useState<IUser[]>([
    new UserModel({
      Id: 1,
      Name: "Demo User",
      Email: "demo@test.com",
      Password: "password123",
      Phone: "+1 555-0100",
      Address: "123 Main St, San Francisco, CA 94105",
    }),
  ]);

  const login = (c: { Email: string; Password: string }) => {
    const f = users.find((u) => u.Email === c.Email && u.Password === c.Password);
    if (f) {
      setUser(f);
      return { success: true };
    }
    return { success: false, error: "Invalid email or password" };
  };

  const register = (data: IUser) => {
    if (users.find((u) => u.Email === data.Email)) {
      return { success: false, error: "Email already registered" };
    }
    const u = new UserModel({ ...data, Id: Date.now() });
    setUsers((p) => [...p, u]);
    setUser(u);
    return { success: true };
  };

  const logout = () => setUser(null);

  return <AuthCtx.Provider value={{ user, login, register, logout }}>{children}</AuthCtx.Provider>;
};

export const useAuth = (): IAuthCtx => {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth");
  return c;
};

const CartCtx = createContext<ICartCtx | null>(null);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ICartItem[]>([]);

  const addItem = (product: IProduct) =>
    setItems((prev) => {
      const ex = prev.find((i) => i.Product.Id === product.Id);
      if (ex) {
        return prev.map((i) =>
          i.Product.Id === product.Id ? { ...i, Quantity: i.Quantity + 1 } : i
        );
      }
      return [
        ...prev,
        new CartItemModel({ Id: Date.now() + Math.random(), Product: product, Quantity: 1 }),
      ];
    });

  const removeItem = (id: number) => setItems((p) => p.filter((i) => i.Id !== id));

  const updateQty = (id: number, qty: number) => {
    if (qty < 1) {
      removeItem(id);
      return;
    }
    setItems((p) => p.map((i) => (i.Id === id ? { ...i, Quantity: qty } : i)));
  };

  const clearCart = () => setItems([]);
  const subtotal = items.reduce((s, i) => s + i.Product.Price * i.Quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const count = items.reduce((s, i) => s + i.Quantity, 0);

  return (
    <CartCtx.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, subtotal, tax, total, count }}
    >
      {children}
    </CartCtx.Provider>
  );
};

export const useCart = (): ICartCtx => {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart");
  return c;
};

const AppCtx = createContext<IAppCtx | null>(null);

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [page, setPage] = useState<Page>("home");
  const [modal, setModal] = useState<ModalType>(null);
  const [order, setOrderState] = useState<IOrder | null>(null);
  const [toasts, setToasts] = useState<IToast[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const navigate = (p: Page) => {
    setPage(p);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  const openModal = (m: NonNullable<ModalType>) => setModal(m);
  const closeModal = () => setModal(null);
  const setOrder = (o: IOrder) => setOrderState(o);

  const showToast = useCallback((msg: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const viewProduct = (p: IProduct) => {
    setSelectedProduct(p);
    navigate("product");
  };

  return (
    <AppCtx.Provider
      value={{
        page,
        navigate,
        modal,
        openModal,
        closeModal,
        order,
        setOrder,
        toasts,
        showToast,
        selectedProduct,
        viewProduct,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
};

export const useApp = (): IAppCtx => {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp");
  return c;
};

export const AppProviders: FC<{ children: ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <CartProvider>
        <AppProvider>{children}</AppProvider>
      </CartProvider>
    </AuthProvider>
  </ThemeProvider>
);
