import { useState, useEffect, useRef } from "react";
import "./Home.css";

const KITS = [
  { name: "Café Lumen", mark: "CL", colors: ["#5B4FFF", "#F2B705", "#2FBF8F"], tag: "Cafetería de especialidad" },
  { name: "Studio Arc", mark: "SA", colors: ["#FF6647", "#14151A", "#F2B705"], tag: "Estudio de arquitectura" },
  { name: "Nord & Co", mark: "N&", colors: ["#2FBF8F", "#5B4FFF", "#FF6647"], tag: "Tienda de ropa" },
  { name: "Vela Yoga", mark: "VY", colors: ["#F2B705", "#FF6647", "#5B4FFF"], tag: "Centro de yoga" },
];

const STEPS = [
  { n: "Paso 1", title: "Cuéntanos de tu negocio", body: "Nombre, sector y el estilo que buscas. Dos minutos de formulario, nada más." },
  { n: "Paso 2", title: "Identikit genera las variantes", body: "La IA produce varias propuestas a la vez, listas para comparar." },
  { n: "Paso 3", title: "Descarga las que te sirvan", body: "Sin marcas de agua, sin cuentas complicadas. Lo que eliges, es tuyo." },
];

const OUTPUTS = [
  { title: "Logos", body: "Marcas limpias, listas para redes, web o cartelería.", colors: ["#5B4FFF", "#2FBF8F"] },
  { title: "Banners", body: "Formatos para web y redes sociales, coherentes con tu logo.", colors: ["#FF6647", "#F2B705"] },
  { title: "Sponsors", body: "Piezas pensadas para aparecer junto a otras marcas sin desentonar.", colors: ["#2FBF8F", "#5B4FFF"] },
];

const FAQ_ITEMS = [
  { q: "¿Es gratis usarlo?", a: "Sí, tu primera identidad completa es gratis. No pedimos tarjeta para probarlo." },
  { q: "¿En qué formato descargo los archivos?", a: "PNG en alta resolución, listo para redes, web o imprenta. Soporte para SVG próximamente." },
  { q: "¿Puedo usar los diseños de forma comercial?", a: "Sí. Todo lo que generas y descargas es tuyo, sin licencias ni atribución obligatoria." },
  { q: "¿Y si ninguna propuesta me convence?", a: "Puedes volver a generar cambiando el estilo o el sector las veces que necesites." },
  { q: "¿Necesito saber de diseño?", a: "No. Rellenas el formulario con lo que sabes de tu negocio, el resto lo resuelve Identikit." },
];

function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    els.forEach((el) => io.observe(el));

    const fallback = setTimeout(() => {
      document.querySelectorAll(".reveal:not(.in-view)").forEach((el) => {
        el.classList.add("in-view");
      });
    }, 1500);

    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);
}

function Faq({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="faq-list">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div className={`faq-item ${open ? "open" : ""}`} key={item.q}>
            <button
              className="faq-question"
              onClick={() => setOpenIndex(open ? -1 : i)}
              aria-expanded={open}
            >
              <h3>{item.q}</h3>
              <span className="faq-icon" aria-hidden="true" />
            </button>
            <div className="faq-answer-wrap">
              <div className="faq-answer-inner">
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const scrolled = useScrolled();
  useReveal();

  const [active, setActive] = useState(0);
  const reduceMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduceMotion.current) return;
    const id = setInterval(() => setActive((p) => (p + 1) % KITS.length), 3200);
    return () => clearInterval(id);
  }, []);

  const kit = KITS[active];

  return (
    <div className="home">
      <nav className={`home-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          identikit
        </div>
        <div className="nav-links">
          <a href="#how">Cómo funciona</a>
          <a href="#outputs">Qué generamos</a>
          <button className="btn btn-primary">
            Empieza gratis <span className="chev">›</span>
          </button>
        </div>
      </nav>

      <header className="hero">
        <div className="eyebrow">Identidad de marca, generada por IA</div>
        <h1>
          Tu marca. <span>Generada en segundos.</span>
        </h1>
        <p className="lead">
          Escribe qué hace tu negocio. Identikit diseña tu identidad visual
          completa, lista para descargar.
        </p>
        <div className="hero-ctas">
          <button className="btn btn-primary btn-lg">
            Empieza gratis <span className="chev">›</span>
          </button>
          <a className="link-ghost" href="#how">Ver cómo funciona</a>
        </div>

        <div className="kit-frame reveal" aria-live="polite">
          <div className="kit-top">
            <span>Vista previa</span>
            <span>{active + 1} / {KITS.length}</span>
          </div>
          <div className="kit-body">
            <div className="kit-mark" style={{ background: kit.colors[0] }}>
              {kit.mark}
            </div>
            <div>
              <p className="kit-name">{kit.name}</p>
              <p className="kit-tag">{kit.tag}</p>
            </div>
          </div>
          <div
            className="kit-banner"
            style={{ background: `linear-gradient(135deg, ${kit.colors[0]}, ${kit.colors[1]})` }}
          />
          <div className="kit-swatches">
            <span className="swatch" style={{ background: kit.colors[0] }} />
            <span className="swatch" style={{ background: kit.colors[1] }} />
            <span className="swatch" style={{ background: kit.colors[2] }} />
          </div>
          <div className="kit-dots">
            {KITS.map((_, i) => (
              <span key={i} className={`dot ${i === active ? "on" : ""}`} />
            ))}
          </div>
        </div>
      </header>

      <section className="how" id="how">
        <div className="section-head reveal">
          <h2>Así de simple</h2>
          <p>Del formulario a tus archivos, en tres pasos.</p>
        </div>
        <div className="how-list">
          {STEPS.map((s, i) => (
            <div className={`how-item reveal reveal-delay-${i % 3}`} key={s.n}>
              <div className="how-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="outputs" id="outputs">
        <div className="outputs-inner">
          <div className="section-head reveal">
            <h2>Lo que generas</h2>
            <p>Tres piezas por generación, coherentes entre sí.</p>
          </div>
          <div className="outputs-grid">
            {OUTPUTS.map((o, i) => (
              <div className={`output-card reveal reveal-delay-${i}`} key={o.title}>
                <div
                  className="output-swatch"
                  style={{ background: `linear-gradient(135deg, ${o.colors[0]}, ${o.colors[1]})` }}
                />
                <h3>{o.title}</h3>
                <p>{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="faq reveal">
        <div className="section-head">
          <h2>Preguntas frecuentes</h2>
        </div>
        <Faq items={FAQ_ITEMS} />
      </section>

      <section className="final-cta">
        <h2 className="reveal">Tu marca, lista para hoy.</h2>
        <p className="reveal">No hace falta tarjeta ni cuenta de diseñador.</p>
        <div className="final-ctas reveal">
          <button className="btn btn-primary btn-lg">
            Empezar gratis <span className="chev">›</span>
          </button>
          <a className="link-ghost" href="#outputs">Ver ejemplos</a>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-inner">
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Producto</h4>
              <a href="#how">Cómo funciona</a>
              <a href="#outputs">Qué generamos</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <a href="#">Privacidad</a>
              <a href="#">Términos</a>
            </div>
          </div>
          <div className="footer-bottom">© 2026 Identikit · Hecho en Girona</div>
        </div>
      </footer>
    </div>
  );
}