import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
  type MouseEvent,
} from "react";
import { useApp, useAuth, useCart, useTheme } from "./contexts/AppContexts";
import { useExternalResources } from "./hooks/useExternalResources";
import { useForm } from "./hooks/useForm";
import type {
  AppButtonProps,
  AppInputProps,
  AppModalProps,
  AuthFormProps,
  FieldValues,
  IProduct,
  Page,
  PaymentModel,
  ProductCardProps,
  ToastType,
} from "./types/app";
import {
  GRADIENTS,
  OrderModel,
  PRODUCTS,
  UserModel,
  PaymentModel as PaymentModelClass,
} from "./types/app";

const AppInput: FC<AppInputProps> = ({ label, name, type = "text", placeholder, register: reg, error, icon, hint, ...rest }) => {
  const field = reg ? reg(name) : {};
  return (
    <div className="mb-3">
      {label && <label className="form-label small fw-semibold mb-1" style={{ opacity: 0.8 }}>{label}</label>}
      <div className={icon ? "input-group" : ""}>
        {icon && <span className="input-group-text" style={{ background: "transparent" }}><i className={`bi bi-${icon} text-muted`}></i></span>}
        <input type={type} className={`form-control ${error ? "is-invalid" : ""}`} placeholder={placeholder} {...field} {...rest} />
        {error && <div className="invalid-feedback d-block">{error}</div>}
      </div>
      {hint && !error && <div className="form-text">{hint}</div>}
    </div>
  );
};

const AppButton: FC<AppButtonProps> = ({ children, variant = "brand", size = "", loading = false, icon, iconEnd, className = "", type = "button", ...rest }) => {
  const cls = variant === "brand" ? "btn-brand" : variant === "outline-brand" ? "btn-outline-brand" : `btn-${variant}`;
  return (
    <button type={type} className={`btn ${cls} ${size ? `btn-${size}` : ""} ${className}`} disabled={loading || rest.disabled} {...rest}>
      {loading ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Processing…</> : <>{icon && <i className={`bi bi-${icon} ${children ? "me-2" : ""}`}></i>}{children}{iconEnd && <i className={`bi bi-${iconEnd} ${children ? "ms-2" : ""}`}></i>}</>}
    </button>
  );
};

const AppModal: FC<AppModalProps> = ({ show, onClose, title, children, size = "", footer }) => {
  useEffect(() => { document.body.style.overflow = show ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [show]);
  if (!show) return null;
  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1060 }} onClick={(e: MouseEvent<HTMLDivElement>) => e.target === e.currentTarget && onClose()}>
        <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${size}`}>
          <div className="modal-content">
            <div className="modal-header border-0 pb-1">
              <h5 className="modal-title brand-font fw-bold">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body pt-2">{children}</div>
            {footer && <div className="modal-footer border-0 pt-0">{footer}</div>}
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" style={{ zIndex: 1055 }}></div>
    </>
  );
};

const StarRating: FC<{ rating: number; size?: string; showNumber?: boolean; count?: number }> = ({ rating, size = "", showNumber = false, count }) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(rating);
    const half = !filled && i < rating;
    return <i key={i} className={`bi bi-${filled ? "star-fill" : half ? "star-half" : "star"} rating-star ${!filled && !half ? "empty" : ""}`} style={{ fontSize: size === "lg" ? "1.1rem" : "0.8rem" }}></i>;
  });
  return <span className="d-inline-flex align-items-center gap-1">{stars}{showNumber && <span className="fw-semibold ms-1" style={{ fontSize: size === "lg" ? "1rem" : "0.82rem" }}>{rating.toFixed(1)}</span>}{count !== undefined && <span className="text-muted" style={{ fontSize: "0.78rem" }}>({count.toLocaleString()})</span>}</span>;
};

const ToastStack: FC = () => {
  const { toasts } = useApp();
  const iconMap: Record<ToastType, string> = { success:"check-circle-fill", danger:"x-circle-fill", warning:"exclamation-triangle-fill", info:"info-circle-fill" };
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-item toast show align-items-center text-bg-${t.type} border-0 rounded-3 shadow`}>
          <div className="d-flex"><div className="toast-body d-flex align-items-center gap-2"><i className={`bi bi-${iconMap[t.type]}`}></i>{t.msg}</div></div>
        </div>
      ))}
    </div>
  );
};

const Navbar: FC = () => {
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { navigate, openModal } = useApp();
  const [dropOpen, setDropOpen] = useState<boolean>(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: globalThis.MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <nav className="navbar sticky-top">
      <div className="container d-flex align-items-center justify-content-between py-2">
        <button className="nav-link-btn d-flex align-items-center gap-2" onClick={() => navigate("home")}>
          <span style={{ fontSize: "1.5rem" }}>🛍️</span>
          <span className="brand-font fw-800 text-brand" style={{ fontSize: "1.3rem", letterSpacing: "-0.5px" }}>ShopFlow</span>
        </button>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width:36,height:36 }} onClick={toggle}>
            <i className={`bi bi-${dark ? "sun-fill" : "moon-fill"}`} style={{ fontSize: "0.8rem" }}></i>
          </button>
          <button className="btn btn-sm btn-outline-secondary position-relative d-flex align-items-center justify-content-center" style={{ width:36,height:36 }} onClick={() => user ? navigate("cart") : openModal("login")}>
            <i className="bi bi-cart3" style={{ fontSize:"0.9rem" }}></i>
            {count > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill badge-brand" style={{ fontSize:"0.6rem" }}>{count > 99 ? "99+" : count}</span>}
          </button>
          {user ? (
            <div className="position-relative" ref={dropRef}>
              <AppButton size="sm" onClick={() => setDropOpen((o) => !o)} className="d-flex align-items-center gap-2">
                <span className="rounded-circle bg-white text-brand d-flex align-items-center justify-content-center fw-bold" style={{ width:22,height:22,fontSize:"0.7rem",minWidth:22 }}>{user.Name.charAt(0).toUpperCase()}</span>
                <span className="d-none d-sm-inline">{user.Name.split(" ")[0]}</span>
                <i className={`bi bi-chevron-${dropOpen ? "up" : "down"}`} style={{ fontSize:"0.65rem" }}></i>
              </AppButton>
              {dropOpen && (
                <ul className="dropdown-menu show shadow-lg border-0" style={{ position:"absolute",right:0,top:"calc(100% + 6px)",minWidth:200,zIndex:1050,borderRadius:12 }}>
                  <li className="px-3 py-2"><div className="small fw-semibold">{user.Name}</div><div className="small text-muted text-truncate">{user.Email}</div></li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li><button className="dropdown-item py-2" onClick={() => { navigate("home"); setDropOpen(false); }}><i className="bi bi-house me-2 text-brand"></i>Home</button></li>
                  <li><button className="dropdown-item py-2" onClick={() => { navigate("cart"); setDropOpen(false); }}><i className="bi bi-cart me-2 text-brand"></i>Cart {count > 0 && <span className="badge badge-brand ms-1">{count}</span>}</button></li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li><button className="dropdown-item py-2 text-danger" onClick={() => { logout(); setDropOpen(false); }}><i className="bi bi-box-arrow-right me-2"></i>Sign Out</button></li>
                </ul>
              )}
            </div>
          ) : (
            <div className="d-flex gap-1">
              <AppButton size="sm" onClick={() => openModal("login")}>Sign In</AppButton>
              <AppButton size="sm" variant="outline-brand" className="d-none d-sm-inline-flex" onClick={() => openModal("register")}>Register</AppButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { openModal, showToast, viewProduct } = useApp();
  const [adding, setAdding] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);
  const gradient = GRADIENTS[product.Id % GRADIENTS.length];
  const discount = product.OriginalPrice ? Math.round((1 - product.Price / product.OriginalPrice) * 100) : 0;
  const handleAdd = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (!user) { openModal("login"); return; }
    setAdding(true);
    setTimeout(() => {
      addItem(product); showToast(`${product.Emoji} ${product.Name} added to cart!`); setAdding(false); setAdded(true); setTimeout(() => setAdded(false), 1800);
    }, 400);
  };
  return <div className="col"><div className="card h-100 border-0 shadow-sm product-card" style={{ overflow:"hidden", cursor:"pointer" }} onClick={() => viewProduct(product)}><div className="product-emoji-bg position-relative" style={{ background:`linear-gradient(${gradient})` }}>{product.Emoji}</div><div className="card-body d-flex flex-column pb-3"><h6 className="card-title mb-1 brand-font" style={{ fontSize:"0.95rem" }}>{product.Name}</h6><div className="mb-1"><StarRating rating={product.Rating} count={product.ReviewCount} /></div><p className="card-text text-muted flex-grow-1" style={{ fontSize:"0.8rem" }}>{product.Description}</p><div className="d-flex align-items-center justify-content-between mt-2"><span className="fw-bold text-brand">${product.Price.toFixed(2)}</span><AppButton size="sm" loading={adding} variant={added ? "outline-success" : "brand"} icon={added ? "check-lg" : "cart-plus"} onClick={handleAdd}>{added ? "Added!" : "Add"}</AppButton></div></div></div></div>;
};

const HomePage: FC = () => {
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("All");
  const categories = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.Category)))];
  const filtered = PRODUCTS.filter((p) => (category === "All" || p.Category === category) && p.Name.toLowerCase().includes(search.toLowerCase()));
  return <div className="container py-4 page-fade"><div className="d-flex gap-2 mb-3"><input className="form-control" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />{categories.map((c) => <button key={c} className={`btn btn-sm ${category===c?"btn-brand":"btn-outline-secondary"}`} onClick={() => setCategory(c)}>{c}</button>)}</div><div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-3">{filtered.map((p) => <ProductCard key={p.Id} product={p} />)}</div></div>;
};

const CartPage: FC = () => {
  const { items, updateQty, removeItem, subtotal, tax, total, count } = useCart();
  const { openModal } = useApp();
  const { user } = useAuth();
  if (items.length === 0) return <div className="container py-5 text-center">Cart is empty</div>;
  return <div className="container py-4"><h3>Cart ({count})</h3>{items.map((item) => <div key={item.Id} className="card mb-2 p-2"><div className="d-flex justify-content-between"><div>{item.Product.Emoji} {item.Product.Name}</div><div><button className="btn btn-sm btn-outline-secondary me-1" onClick={() => updateQty(item.Id, item.Quantity - 1)}>-</button>{item.Quantity}<button className="btn btn-sm btn-outline-secondary ms-1" onClick={() => updateQty(item.Id, item.Quantity + 1)}>+</button><button className="btn btn-sm btn-link text-danger" onClick={() => removeItem(item.Id)}>x</button></div></div></div>)}<div className="mt-3">Total: ${total.toFixed(2)} (sub ${subtotal.toFixed(2)} + tax ${tax.toFixed(2)})</div><AppButton className="mt-2" onClick={() => (!user ? openModal("login") : openModal("payment"))}>Checkout</AppButton></div>;
};

const ProductDetailPage: FC = () => {
  const { selectedProduct, navigate } = useApp();
  if (!selectedProduct) { navigate("home"); return null; }
  return <div className="container py-4"><AppButton variant="outline-secondary" onClick={() => navigate("home")}>Back</AppButton><h2 className="mt-3">{selectedProduct.Emoji} {selectedProduct.Name}</h2><p>{selectedProduct.LongDescription}</p></div>;
};

const PaymentSuccessPage: FC = () => {
  const { order, navigate } = useApp();
  if (!order) { navigate("home"); return null; }
  return <div className="container py-5 text-center"><h2>✅ Payment Successful</h2><p>Order {order.Id}</p><AppButton onClick={() => navigate("invoice")}>Invoice</AppButton></div>;
};

const InvoicePage: FC = () => {
  const { order, navigate } = useApp();
  if (!order) { navigate("home"); return null; }
  return <div className="container py-4"><h2>Invoice #{order.Id}</h2><AppButton onClick={() => window.print()}>Print</AppButton></div>;
};

interface LoginFields extends FieldValues { Email: string; Password: string; }
const LoginForm: FC<AuthFormProps> = ({ onSwitch }) => {
  const { login } = useAuth();
  const { closeModal, showToast } = useApp();
  const [serverError, setServerError] = useState<string>("");
  const { register, handleSubmit, errors } = useForm<LoginFields>({ Email: "", Password: "" }, { Email: { required: "Email required" }, Password: { required: "Password required" } });
  const registerField = (name: string) => register(name as keyof LoginFields);
  const onSubmit = (v: LoginFields) => { const r = login(v); if (r.success) { showToast("Welcome back! 👋"); closeModal(); } else setServerError(r.error ?? "Login failed"); };
  return <form onSubmit={handleSubmit(onSubmit)}>{serverError && <div className="alert alert-danger">{serverError}</div>}<AppInput label="Email" name="Email" register={registerField} error={errors.Email} /><AppInput label="Password" name="Password" type="password" register={registerField} error={errors.Password} /><AppButton type="submit" className="w-100">Sign In</AppButton><p className="small mt-2">No account? <button className="btn btn-link btn-sm p-0" type="button" onClick={onSwitch}>Register</button></p></form>;
};

interface RegisterFields extends FieldValues { Name:string; Email:string; Password:string; ConfirmPassword:string; Phone:string; Address:string; }
const RegisterForm: FC<AuthFormProps> = ({ onSwitch }) => {
  const { register: authRegister } = useAuth();
  const { closeModal, showToast } = useApp();
  const [serverError, setServerError] = useState<string>("");
  const { register, handleSubmit, errors } = useForm<RegisterFields>({ Name:"",Email:"",Password:"",ConfirmPassword:"",Phone:"",Address:"" });
  const registerField = (name: string) => register(name as keyof RegisterFields);
  const onSubmit = (d: RegisterFields) => {
    const r = authRegister(new UserModel({ Name:d.Name, Email:d.Email, Password:d.Password, Phone:d.Phone, Address:d.Address }));
    if (r.success) { showToast("Account created! Welcome 🎉"); closeModal(); } else setServerError(r.error ?? "Failed");
  };
  return <form onSubmit={handleSubmit(onSubmit)}>{serverError && <div className="alert alert-danger">{serverError}</div>}<AppInput label="Full Name" name="Name" register={registerField} error={errors.Name} /><AppInput label="Email" name="Email" register={registerField} error={errors.Email} /><AppInput label="Password" name="Password" type="password" register={registerField} error={errors.Password} /><AppButton type="submit" className="w-100">Create Account</AppButton><p className="small mt-2">Have account? <button className="btn btn-link btn-sm p-0" type="button" onClick={onSwitch}>Sign in</button></p></form>;
};

type AuthView = "login" | "register";
const AuthModal: FC = () => {
  const { modal, closeModal } = useApp();
  const [view, setView] = useState<AuthView>("login");
  const isOpen = modal === "login" || modal === "register";
  useEffect(() => { if (modal === "login") setView("login"); if (modal === "register") setView("register"); }, [modal]);
  return <AppModal show={isOpen} onClose={closeModal} title={view === "login" ? "Welcome Back" : "Join ShopFlow"}>{view === "login" ? <LoginForm onSwitch={() => setView("register")} /> : <RegisterForm onSwitch={() => setView("login")} />}</AppModal>;
};

interface PaymentFields extends FieldValues { CardHolder:string; CardNumber:string; Expiry:string; CVV:string; }
const PaymentModal: FC = () => {
  const { modal, closeModal, setOrder, navigate, showToast } = useApp();
  const { items, total, tax, clearCart } = useCart();
  const { user } = useAuth();
  const { register, handleSubmit } = useForm<PaymentFields>({ CardHolder:user?.Name??"", CardNumber:"", Expiry:"", CVV:"" });
  const registerField = (name: string) => register(name as keyof PaymentFields);
  const onSubmit = (data: PaymentFields) => {
    if (!user) return;
    const _pay = new PaymentModelClass({ Id:`PAY-${Date.now()}`, CardHolder:data.CardHolder, CardNumber:data.CardNumber, Expiry:data.Expiry, Amount:total });
    const newOrder = new OrderModel({ Id:`ORD-${Date.now()}`, User:user, Items:[...items], Total:total, Tax:tax, Status:"Confirmed", CreatedAt:new Date() });
    setOrder(newOrder); clearCart(); closeModal(); navigate("success"); showToast("Payment successful! 🎉");
    void _pay;
  };
  return <AppModal show={modal === "payment"} onClose={closeModal} title="Secure Checkout"><form onSubmit={handleSubmit(onSubmit)}><AppInput label="Name" name="CardHolder" register={registerField} /><AppInput label="Card Number" name="CardNumber" register={registerField} /><AppInput label="Expiry" name="Expiry" register={registerField} /><AppInput label="CVV" name="CVV" register={registerField} /><AppButton type="submit">Pay ${total.toFixed(2)}</AppButton></form></AppModal>;
};

const AppShell: FC = () => {
  useExternalResources();
  const { dark } = useTheme();
  const { page } = useApp();
  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "product": return <ProductDetailPage />;
      case "cart": return <CartPage />;
      case "success": return <PaymentSuccessPage />;
      case "invoice": return <InvoicePage />;
      default: return <HomePage />;
    }
  };

  return (
    <div data-bs-theme={dark ? "dark" : "light"} style={{ minHeight: "100vh" }}>
      {page !== "invoice" && <Navbar />}
      <main>{renderPage()}</main>
      {page !== "invoice" && <footer className="border-top mt-5 py-4 text-center"><div className="container"><div className="brand-font fw-800 text-brand mb-1">🛍️ ShopFlow</div></div></footer>}
      <AuthModal />
      <PaymentModal />
      <ToastStack />
    </div>
  );
};

export default AppShell;
