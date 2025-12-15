// Single-file SEO snippet (CONFIG + META_DATA + LD_DATA + runtime)

(function () {
  "use strict";


  const CONFIG = {
    baseUrlFallback: "https://www.varnishdesign.com",
    googleSiteVerification: "gKBJaxcjYq0znWUos778XyvpfS3P9IB7QzXiwI1H18s"
  };

  // === DATA (from your previous meta-tags.js) ===
  const META_DATA = {"meta_tags_list":[{"page_url":"https://www.varnishdesign.com/","title_tag":"Interior Design Edina | Varnish Design","meta_description":"Varnish Design offers luxury interior design, home styling, vintage accessories and lighting design in Edina and Minnesota. Schedule a design consultation or space redesign."},{"page_url":"https://www.varnishdesign.com/interiordesign","title_tag":"Luxury Interior Design Edina | Varnish Design","meta_description":"Full-service interior design in Edina and Las Vegas. We provide luxury interiors, furnishings, kitchen remodeling, office design and design consultations to refine your space."},{"page_url":"https://www.varnishdesign.com/inquiry","title_tag":"Design Consultation MN | Varnish Design","meta_description":"Contact Varnish Design in Edina to schedule a design consultation, discovery call or in-person consult for project inquiries, budgets, or collaborations."}],"keywords":["Interior Design Edina","Home Decor Minnesota","Furniture Design Edina","Design Consultation MN","Space Redesign Edina","Vintage Accessories Minnesota","Lighting Design Edina","Kitchen Remodeling MN","Office Design Edina","Home Styling Minnesota","Las Vegas Interior Design","Luxury Interior Design","Hospitality Design","High End Design","Interior Design Las Vegas"]};

  // === DATA (from your previous LD.js) ===
  const LD_DATA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Varnish Design",
  "url": "https://www.varnishdesign.com/",
  "logo": "https://static.wixstatic.com/media/c0bc3a_d189b694f2a14e66bf73bb38488fb960~mv2.png/v1/fill/w_164,h_47,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/varnishlogooutlinestroke.png",
  "image": [
    "https://static.wixstatic.com/media/c0bc3a_9610dce5b26d42b99e0ea2f0540123a5~mv2.jpg/v1/fill/w_295,h_443,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/VarnishDesigns-2.jpg",
    "https://static.wixstatic.com/media/c0bc3a_3fc03c55cc3645b9a122bfc2f5e2ff80%7Emv2.png/v1/fit/w_2500,h_1330,al_c/c0bc3a_3fc03c55cc3645b9a122bfc2f5e2ff80%7Emv2.png",
    "https://static.wixstatic.com/media/c0bc3a_d189b694f2a14e66bf73bb38488fb960~mv2.png/v1/fill/w_169,h_48,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/varnishlogooutlinestroke.png"
  ],
  "description": "REFINE. RESTORE. REIMAGINE. Varnish Design provides interior design services for homes and offices including full-service design, furnishings plans, and in-person consultations.",
  "telephone": "+1-702-606-3162",
  "email": "hello@varnishdesign.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "4402 1/2 France Ave. S",
    "addressLocality": "Edina",
    "addressRegion": "MN",
    "postalCode": "55410",
    "addressCountry": "US"
  },
  "sameAs": [
    "https://www.instagram.com/varnish_design"
  ],
  "founder": {
    "@type": "Person",
    "name": "Amy Strodl",
    "jobTitle": "Principal & Creative Director",
    "description": "20 years experience in interior design; received undergraduate degree from UNLV and interior design degree from UCLA Extension; licensed in Nevada and Minnesota; NCIDQ certified."
  },
  "service": [
    {
      "@type": "Service",
      "name": "Full Service Design",
      "description": "Design fees starting at $5,000. Comprehensive design for new construction or major renovation including furniture and lighting plans, elevations, millwork details, and finish schedules."
    },
    {
      "@type": "Service",
      "name": "Furnishings Plan",
      "description": "Design fees starting at $3,000. Sourcing and purchasing furniture, drapery, decorative lighting, art and accessories; delivery, inspection, storage, and installation."
    },
    {
      "@type": "Service",
      "name": "In-Person Consult",
      "description": "Hourly rate $175. In-studio consultation to review design plans, access curated design library and trade resources, and source finishes."
    }
  ]
};

  /* ===== Helpers ===== */
  function clamp(str, max) {
    if (typeof str !== "string") str = String(str ?? "");
    return str.length <= max ? str : str.slice(0, Math.max(0, max - 1)) + "…";
  }

  function stripTrailingSlash(p) {
    if (!p) return "/";
    return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
  }

  function normalizePathFromUrl(url) {
    try {
      const u = new URL(url);
      return stripTrailingSlash(u.pathname || "/");
    } catch {
      const m = String(url || "").match(/^https?:\/\/[^/]+(\/[^?#]*)?/i);
      return stripTrailingSlash((m && m[1]) || "/");
    }
  }

  function removeLangPrefix(pathname) {
    const m = String(pathname || "/").match(
      /^\/([a-z]{2}(?:-[A-Z]{2})?)(?=\/|$)(.*)$/
    );
    if (!m) return pathname || "/";
    const rest = stripTrailingSlash(m[2] || "/");
    return rest || "/";
  }

  function currentPagePath() {
    const path = window.location.pathname || "/";
    return stripTrailingSlash(path || "/");
  }

  function currentKeyCandidates() {
    const path = currentPagePath();
    const origin = (window.location.origin || "").replace(/\/$/, "");
    const full = origin + path;

    if (path === "/") {
      return [full, "/"];
    }

    const noLang = removeLangPrefix(path);
    return [full, path, stripTrailingSlash(path), noLang, stripTrailingSlash(noLang)];
  }

  function buildIndex(metaJson) {
    const list = (metaJson && metaJson.meta_tags_list) || [];
    const index = {};
    for (const item of list) {
      const path = normalizePathFromUrl(item.page_url);
      let origin = "";
      try {
        origin = new URL(item.page_url).origin;
      } catch {
        origin = "";
      }
      const full = origin ? origin.replace(/\/$/, "") + path : "";

      const entry = {
        title: item.title_tag || "",
        description: item.meta_description || "",
      };

      index[path] = entry;
      index[stripTrailingSlash(path)] = entry;
      if (full) index[full] = entry;
    }
    return index;
  }

  function _stripQuotes(s) {
    return String(s ?? "")
      .replace(/["'“”‘’„«»]/g, "")
      .replace(/\s+/g, " ")
      .replace(/^[\s\-–—·,;:]+|[\s\-–—·,;:]+$/g, "")
      .trim();
  }

  function normalizeKeywordsList(input, opts) {
    const { maxKeywords = 20 } = opts || {};
    if (input == null) return [];
    let items = Array.isArray(input)
      ? input.slice()
      : typeof input === "string"
      ? input.split(",")
      : [];
    const seen = new Set();
    return items
      .map(_stripQuotes)
      .filter((s) => s && s.length >= 2)
      .filter((s) => {
        const k = s.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .slice(0, maxKeywords);
  }

  function normalizeKeywords(input, opts) {
    const { maxKeywords = 20, maxLength = 280 } = opts || {};
    const list = normalizeKeywordsList(input, { maxKeywords });
    const content = list.join(", ");
    return content.length > maxLength ? content.slice(0, maxLength) : content;
  }

  function applyAltFallbacks(keywordsPool) {
    if (!Array.isArray(keywordsPool) || keywordsPool.length === 0) return;
    try {
      const images = Array.from(document.querySelectorAll("img"));
      let i = 0;
      images.forEach((img) => {
        const curAlt = (img.getAttribute("alt") || "").trim().toLowerCase();
        const shouldReplace =
          !curAlt ||
          curAlt.endsWith(".jpg") ||
          curAlt.endsWith(".png") ||
          curAlt === "image" ||
          curAlt === "img";
        if (shouldReplace) {
          img.setAttribute("alt", keywordsPool[i % keywordsPool.length]);
          i++;
        }
      });
    } catch {
      /* ignore */
    }
  }

  function optimizeImages() {
    try {
      const images = Array.from(document.querySelectorAll("img"));
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              io.unobserve(img);
              // hook for tracking / lazy work if needed
            }
          });
        });
        images.forEach((img, index) => {
          if (index > 0) io.observe(img);
        });
      }
    } catch (err) {
      console.error("Image optimization error:", err);
    }
  }

  function upsertMeta(nameOrProperty, content, useProperty) {
    const selector = useProperty
      ? `meta[property="${nameOrProperty}"]`
      : `meta[name="${nameOrProperty}"]`;
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement("meta");
      if (useProperty) el.setAttribute("property", nameOrProperty);
      else el.setAttribute("name", nameOrProperty);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function upsertLink(rel, href) {
    let link = document.head.querySelector(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", rel);
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);
  }

  function injectJsonLd(ldObject) {
    if (!ldObject) return;
    try {
      const existing = Array.from(
        document.head.querySelectorAll('script[type="application/ld+json"]')
      );
      existing.forEach((el) => {
        el.parentNode.removeChild(el);
      });

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(ldObject);
      document.head.appendChild(script);
    } catch (err) {
      console.error("Error injecting JSON-LD:", err);
    }
  }

  function applyJsonLd() {
    injectJsonLd(LD_DATA);
  }

  function applySeoFromJson() {
    try {
      const metaJson = META_DATA;
      const index = buildIndex(metaJson);

      const path = currentPagePath();
      const isHome = path === "/";

      const fallbackBase =
        (CONFIG && CONFIG.baseUrlFallback) ? CONFIG.baseUrlFallback : "";
      const baseUrl = (window.location.origin || fallbackBase).replace(/\/$/, "");
      const canonicalUrl = baseUrl + path;

      const keys = currentKeyCandidates();
      let entry = null;
      for (const k of keys) {
        if (index[k]) {
          entry = index[k];
          break;
        }
      }

      if (!entry) {
        return normalizeKeywordsList(metaJson.keywords, { maxKeywords: 25 });
      }

      const title = clamp(entry.title, 60);
      const desc = clamp(entry.description, 185);

      document.title = title;

      const metaList = [
        { type: "name", key: "description", content: desc },
        { type: "property", key: "og:url", content: canonicalUrl },
        { type: "name", key: "resource-hints", content: "preload" },
        { type: "name", key: "format-detection", content: "telephone=yes" },
        { type: "name", key: "mobile-web-app-capable", content: "yes" },
        { type: "name", key: "apple-mobile-web-app-capable", content: "yes" },
      ];

      // opcjonalnie dodaj google-site-verification, jeśli jest w CONFIG
      if (CONFIG && CONFIG.googleSiteVerification) {
        metaList.push({
          type: "name",
          key: "google-site-verification",
          content: CONFIG.googleSiteVerification
        });
      }

      if (isHome && metaJson && metaJson.keywords) {
        const kwContent = normalizeKeywords(metaJson.keywords, {
          maxKeywords: 25,
          maxLength: 512,
        });
        if (kwContent) {
          metaList.push({ type: "name", key: "keywords", content: kwContent });
        }
      }

      metaList.forEach((m) => {
        upsertMeta(m.key, m.content, m.type === "property");
      });

      upsertLink("canonical", canonicalUrl);

      return normalizeKeywordsList(metaJson.keywords, { maxKeywords: 25 });
    } catch (err) {
      console.error("Error meta settings:", err);
      return [];
    }
  }

  function initSnippetSEO() {
    const keywordsPool = applySeoFromJson();
    const path = currentPagePath();
    if (path === "/") {
      applyJsonLd();
    }
    optimizeImages();
    applyAltFallbacks(keywordsPool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSnippetSEO);
  } else {
    initSnippetSEO();
  }
})();
