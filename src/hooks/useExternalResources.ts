import { useEffect } from "react";

/* ══════════════════════════════════════════════════════════
   EXTERNAL RESOURCES
══════════════════════════════════════════════════════════ */
export function useExternalResources(): void {
  useEffect(() => {
    const urls = [
      "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css",
      "https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap",
    ];

    const nodes: (HTMLLinkElement | HTMLStyleElement)[] = urls.map((href) => {
      const el = document.createElement("link");
      el.rel = "stylesheet";
      el.href = href;
      document.head.appendChild(el);
      return el;
    });

    const style = document.createElement("style");
    style.textContent = `
      :root {
        --brand:#6366F1; --brand-dark:#4F46E5; --brand-light:#EEF2FF;
        --success-c:#10B981; --fh:'Syne',sans-serif; --fb:'DM Sans',sans-serif;
        --shadow:0 4px 24px rgba(0,0,0,.07); --shadow-hover:0 12px 32px rgba(0,0,0,.12); --radius:14px;
      }
      *,body{font-family:var(--fb)!important;}
      h1,h2,h3,h4,h5,h6,.brand-font{font-family:var(--fh)!important;}
      .btn-brand{background:var(--brand);border-color:var(--brand);color:#fff;font-weight:500;}
      .btn-brand:hover,.btn-brand:focus{background:var(--brand-dark);border-color:var(--brand-dark);color:#fff;}
      .btn-brand:disabled{background:var(--brand);border-color:var(--brand);opacity:.55;}
      .btn-outline-brand{border-color:var(--brand);color:var(--brand);font-weight:500;}
      .btn-outline-brand:hover{background:var(--brand);color:#fff;}
      .badge-brand{background:var(--brand)!important;}
      .text-brand{color:var(--brand)!important;}
      .bg-brand{background:var(--brand)!important;}
      .card{border-radius:var(--radius)!important;transition:transform .22s ease,box-shadow .22s ease;}
      .product-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-hover)!important;}
      .page-fade{animation:fadeUp .35s ease both;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
      .navbar{backdrop-filter:blur(12px);border-bottom:1px solid rgba(128,128,128,.1);}
      [data-bs-theme="dark"] .navbar{background:rgba(15,23,42,.85)!important;}
      [data-bs-theme="light"] .navbar{background:rgba(255,255,255,.92)!important;}
      .modal{z-index:1060;}.modal-backdrop{z-index:1055;}
      .modal-content{border-radius:var(--radius)!important;border:none!important;box-shadow:0 24px 64px rgba(0,0,0,.18)!important;}
      .hero-gradient{background:linear-gradient(135deg,var(--brand) 0%,#8B5CF6 60%,#EC4899 100%);}
      .product-emoji-bg{height:185px;display:flex;align-items:center;justify-content:center;font-size:4.5rem;border-radius:var(--radius) var(--radius) 0 0;transition:transform .3s ease;}
      .product-card:hover .product-emoji-bg{transform:scale(1.05);}
      .qty-btn{width:32px;height:32px;padding:0;border-radius:8px!important;display:flex;align-items:center;justify-content:center;}
      .input-group-text{border-right:0;}
      .input-group .form-control{border-left:0;}
      .step-indicator{display:flex;align-items:center;gap:8px;}
      .step-dot{width:8px;height:8px;border-radius:50%;background:rgba(128,128,128,.3);}
      .step-dot.active{background:var(--brand);width:24px;border-radius:4px;}
      @media print{
        .no-print{display:none!important;}
        body{print-color-adjust:exact;-webkit-print-color-adjust:exact;}
        .invoice-wrap{padding:0!important;max-width:100%!important;}
      }
      .success-bounce{animation:successBounce .6s cubic-bezier(.36,.07,.19,.97) both;}
      @keyframes successBounce{0%{transform:scale(0) rotate(-30deg);opacity:0}60%{transform:scale(1.2) rotate(5deg)}100%{transform:scale(1) rotate(0);opacity:1}}
      .toast-stack{position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;}
      .toast-item{animation:toastIn .3s ease both;}
      @keyframes toastIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}
      .card-chip{width:42px;height:28px;border-radius:5px;background:linear-gradient(135deg,#d4a017,#f5e07f,#b8881a);box-shadow:inset 0 1px 2px rgba(255,255,255,.4);}
      .credit-card-preview{background:linear-gradient(135deg,var(--brand) 0%,#8B5CF6 100%);border-radius:16px;color:white;padding:20px;min-height:160px;position:relative;overflow:hidden;font-family:'Courier New',monospace;box-shadow:0 8px 32px rgba(99,102,241,.4);}
      .credit-card-preview::after{content:'';position:absolute;right:-30px;top:-30px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,.08);}
      .credit-card-preview::before{content:'';position:absolute;right:40px;top:40px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.05);}
      [data-bs-theme="dark"] .bg-light-subtle{background:rgba(255,255,255,.04)!important;}
      [data-bs-theme="light"] .bg-light-subtle{background:rgba(0,0,0,.03)!important;}
      .nav-link-btn{background:none;border:none;padding:0;color:inherit;cursor:pointer;font-family:var(--fb);}

      /* ── Product Gallery ── */
      .gallery-main{
        border-radius:20px;overflow:hidden;cursor:zoom-in;
        position:relative;
        transition:box-shadow .3s ease;
      }
      .gallery-main:hover{box-shadow:0 20px 60px rgba(0,0,0,.18);}
      .gallery-thumb{
        border-radius:12px;overflow:hidden;cursor:pointer;border:3px solid transparent;
        transition:border-color .2s ease,transform .2s ease,box-shadow .2s ease;
        flex-shrink:0;
      }
      .gallery-thumb:hover{transform:scale(1.05);}
      .gallery-thumb.active{border-color:var(--brand);box-shadow:0 4px 16px rgba(99,102,241,.3);}
      .gallery-zoom-overlay{
        position:absolute;inset:0;background:rgba(0,0,0,0);
        display:flex;align-items:center;justify-content:center;
        opacity:0;transition:all .25s ease;
        border-radius:20px;
      }
      .gallery-main:hover .gallery-zoom-overlay{background:rgba(0,0,0,.08);opacity:1;}
      .image-panel{
        width:100%;height:100%;display:flex;align-items:center;justify-content:center;
        transition:transform .55s cubic-bezier(.4,0,.2,1),opacity .3s ease;
      }
      .image-fade-enter{animation:imgFade .35s ease both;}
      @keyframes imgFade{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}

      .rating-star{color:#FBBF24;}
      .rating-star.empty{color:#D1D5DB;}

      .spec-row:nth-child(even){background:rgba(128,128,128,.04);}
      .spec-row{padding:10px 14px;border-radius:8px;transition:background .15s;}

      .review-card{border-radius:14px!important;transition:transform .2s ease,box-shadow .2s ease;}
      .review-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-hover)!important;}

      .progress-bar-custom{height:6px;border-radius:3px;background:var(--brand);}
      .progress-track{height:6px;border-radius:3px;background:rgba(128,128,128,.15);flex:1;}

      .related-scroll{display:flex;gap:16px;overflow-x:auto;padding-bottom:8px;scroll-snap-type:x mandatory;}
      .related-scroll::-webkit-scrollbar{height:4px;}
      .related-scroll::-webkit-scrollbar-track{background:transparent;}
      .related-scroll::-webkit-scrollbar-thumb{background:rgba(128,128,128,.25);border-radius:2px;}
      .related-item{scroll-snap-align:start;flex-shrink:0;width:200px;cursor:pointer;border-radius:14px!important;}

      .tag-chip{display:inline-flex;align-items:center;padding:4px 12px;border-radius:20px;font-size:.75rem;font-weight:500;background:var(--brand-light);color:var(--brand);}
      [data-bs-theme="dark"] .tag-chip{background:rgba(99,102,241,.2);}

      .sticky-buy-bar{
        position:sticky;bottom:0;z-index:50;
        backdrop-filter:blur(16px);
        border-top:1px solid rgba(128,128,128,.12);
        padding:12px 0;
      }
      [data-bs-theme="dark"] .sticky-buy-bar{background:rgba(15,23,42,.92);}
      [data-bs-theme="light"] .sticky-buy-bar{background:rgba(255,255,255,.95);}

      .discount-badge{background:linear-gradient(135deg,#EF4444,#F97316);color:white;border-radius:6px;padding:2px 8px;font-size:.72rem;font-weight:700;}
    `;

    document.head.appendChild(style);
    nodes.push(style);

    return () =>
      nodes.forEach((el) => {
        try {
          document.head.removeChild(el);
        } catch (error) {
          // Ignore nodes that are already removed.
        }
      });
  }, []);
}
