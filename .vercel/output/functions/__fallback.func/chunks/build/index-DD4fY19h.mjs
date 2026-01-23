import { defineComponent, defineAsyncComponent, withAsyncContext, mergeProps, unref, computed, createVNode, resolveDynamicComponent, ref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderVNode, ssrRenderClass } from 'vue/server-renderer';
import { PhArrowRight, PhBriefcase, PhRocket, PhBuildings, PhStudent, PhInfo, PhMapPin, PhChalkboardTeacher, PhStrategy, PhHandshake, PhGlobeHemisphereWest, PhRocketLaunch } from '@phosphor-icons/vue';
import { u as useAsyncData } from './asyncData-wAjEz6As.mjs';
import { q as queryCollection } from './client-DqbjtPWP.mjs';
import { I as ImageComponent } from './NuxtImg-DKyZQHcs.mjs';
import { u as useHighlightText } from './useHighlightText-BbVqnJqf.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-DU2Yg8bd.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { a as useSeoMeta } from './server.mjs';
import 'perfect-debounce';
import '../nitro/nitro.mjs';
import 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'consola';
import 'minimatch';
import 'better-sqlite3';
import 'node:url';
import 'ipx';
import 'vue-router';
import 'qs';
import 'tailwindcss/colors';
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main$4 = {
  __name: "HeroSection",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: heroData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "hero",
      () => queryCollection("hero").first()
    )), __temp = await __temp, __restore(), __temp);
    console.log("heroData", JSON.stringify(heroData.value, null, 2));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative overflow-hidden min-h-[600px] xl:min-h-[700px] overflow-hidden relative flex flex-col justify-center items-center md:py-20 px-4" }, _attrs))}><div class="relative inset-0 md:top-0 md:left-0 w-full aspect-[16/9] overflow-hidden md:absolute"><iframe class="min-h-[600px] xl:min-h-[700px] shrink-0" loading="lazy" title="Gumlet video player"${ssrRenderAttr("src", unref(heroData)?.videoURL || "https://play.gumlet.io/embed/6909c55e9940b0c5ad2e420e?background=true&autoplay=true&loop=true&disableControls=true")} style="${ssrRenderStyle({ "border": "none", "position": "absolute", "top": "0", "left": "0", "width": "100vw", "height": "100vh", "pointer-events": "none" })}" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;"></iframe></div><div class="max-w-7xl relative flex flex-col items-center gap-x-10 mx-auto px-4 sm:px-6 lg:px-32 pt-16 py-10 md:py-20 bg-white/80 backdrop-blur-sm rounded-2xl"><div class=""><div class="flex justify-center mb-5"><a class="inline-flex items-center gap-x-2 bg-white border border-[#E60000] text-xs text-[#E60000] p-2 px-3 rounded-full transition hover:border-gray-300 focus:outline-hidden focus:border-gray-300" href="#"> AFRICA BUSINESS BUREAU </a></div><div class="max-w-3xl text-center animate-on-scroll"><h1 class="block font-bold text-gray-800 text-4xl md:text-6xl lg:text-7xl">${ssrInterpolate(unref(heroData)?.title || "hero title")}</h1></div></div><div class="flex flex-col justify-end"><div class="max-w-3xl text-center animate-on-scroll delay-100"><p class="text-lg text-gray-600">${ssrInterpolate(unref(heroData)?.description || "hero description")}</p></div><div class="mt-5 md:mt-10 gap-3 flex justify-center animate-on-scroll delay-200"><a class="inline-flex justify-center items-center gap-x-3 text-center bg-linear-to-tl from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 focus:outline-hidden focus:from-red-600 focus:to-red-500 border border-transparent text-white text-base font-bold rounded-full py-3 px-4"${ssrRenderAttr("href", unref(heroData)?.heroCTA?.url || "#services")}>${ssrInterpolate(unref(heroData)?.heroCTA?.ctaText || "hero cta text")} `);
      _push(ssrRenderComponent(unref(PhArrowRight), { class: "shrink-0 size-7 rotate-45" }, null, _parent));
      _push(`</a></div></div></div></div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HeroSection.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "CountUp",
  __ssrInlineRender: true,
  props: {
    to: {
      type: [Number, String],
      required: true
    },
    duration: {
      type: Number,
      default: 2e3
    }
  },
  setup(__props) {
    const props = __props;
    const elementRef = ref(null);
    const currentDisplay = ref("0");
    ref(false);
    computed(() => {
      const str = String(props.to);
      const numberMatch = str.match(/[\d,.]+/);
      const number = numberMatch ? parseFloat(numberMatch[0].replace(/,/g, "")) : 0;
      const suffix = str.replace(/[\d,.]+/, "");
      return { number, suffix };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        ref_key: "elementRef",
        ref: elementRef
      }, _attrs))}>${ssrInterpolate(currentDisplay.value)}</span>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CountUp.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$3, { __name: "CountUp" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AboutSection",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { transform } = useHighlightText();
    const { data: aboutSection } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "about-section",
      () => queryCollection("home_about").first(),
      { lazy: true }
    )), __temp = await __temp, __restore(), __temp);
    const { data: aboutPage } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "about-page-data",
      () => queryCollection("about").first(),
      { lazy: true }
    )), __temp = await __temp, __restore(), __temp);
    const iconMap = {
      "People Trained": PhStudent,
      "Businesses Supported": PhBuildings,
      "Startups Incubated & Funded": PhRocket,
      "Jobs Created": PhBriefcase
    };
    const displayedStats = computed(() => {
      const stats = aboutPage.value?.stats || [];
      return stats.map((stat) => ({
        ...stat,
        icon: iconMap[stat.label] || PhInfo
      }));
    });
    const sectionImageUrl = computed(() => {
      const url = aboutSection.value?.sectionImage?.url;
      return url || "https://africabusinessbureau.com/wp-content/uploads/2024/10/Progress-Report-Ghana-Economic-Transformation-Project-13-2-scaled.jpg";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = ImageComponent;
      const _component_CountUp = __nuxt_component_1;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-20 md:py-60 overflow-hidden" }, _attrs))}><div class="container mx-auto px-4 md:px-6"><div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"><div class="relative animate-on-scroll"><div class="relative z-10 rounded-lg overflow-hidden">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: unref(sectionImageUrl),
        alt: unref(aboutSection)?.sectionImage?.alternativeText || "Modern coworking space",
        class: "w-full h-full object-cover min-h-[400px] lg:min-h-[600px]",
        format: "webp",
        loading: "lazy"
      }, null, _parent));
      _push(`</div><div class="absolute -top-10 -left-4 md:-left-10 z-20 w-64 md:w-72 bg-[#E60000] p-8 rounded-2xl shadow-xl text-white hidden md:block animate-on-scroll delay-200"><h3 class="text-2xl font-bold mb-4">${ssrInterpolate(unref(aboutSection)?.preHeader || "preHeader")}</h3><p class="text-base leading-relaxed opacity-90">${ssrInterpolate(unref(aboutSection)?.preDescription || "preDescription")}</p></div><div class="md:hidden mt-6 bg-[#E60000] p-6 rounded shadow-xl text-white animate-on-scroll delay-200"><h3 class="text-xl font-bold mb-3">${ssrInterpolate(unref(aboutSection)?.preHeader || "preHeader")}</h3><p class="text-sm leading-relaxed opacity-90">${ssrInterpolate(unref(aboutSection)?.preDescription || "preDescription")}</p></div></div><div class="lg:pl-10"><h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-6 leading-tight animate-on-scroll">${unref(transform)(unref(aboutSection)?.title || "title") ?? ""}</h2><p class="text-gray-600 mb-12 text-lg leading-relaxed animate-on-scroll delay-100 whitespace-pre-line">${ssrInterpolate(unref(aboutSection)?.body || "body")}</p><div class="grid grid-cols-2 gap-x-8 gap-y-12 animate-on-scroll delay-200"><!--[-->`);
      ssrRenderList(unref(displayedStats), (stat) => {
        _push(`<div class="flex flex-col"><div class="flex items-center gap-3 mb-2"><span class="text-gray-900">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(stat.icon), {
          size: 28,
          weight: "light"
        }, null), _parent);
        _push(`</span><span class="text-4xl font-bold text-gray-900">`);
        _push(ssrRenderComponent(_component_CountUp, {
          to: stat.value
        }, null, _parent));
        _push(`</span></div><span class="text-gray-600 font-medium">${ssrInterpolate(stat.label)}</span></div>`);
      });
      _push(`<!--]--></div><a id="about"${ssrRenderAttr("href", unref(aboutSection)?.sectionCTA?.url || "#about")} class="inline-flex justify-center mt-5 md:mt-10 items-center gap-x-3 text-center bg-linear-to-tl from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 focus:outline-hidden focus:from-red-600 focus:to-red-500 border border-transparent text-white text-base font-bold rounded-full py-3 px-4 animate-on-scroll delay-300">`);
      _push(ssrRenderComponent(unref(PhInfo), { class: "shrink-0 size-6" }, null, _parent));
      _push(` ${ssrInterpolate(unref(aboutSection)?.sectionCTA?.ctaText || "sectionCTA")}</a></div></div></div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AboutSection.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AboutSection = Object.assign(_sfc_main$2, { __name: "AboutSection" });
const servicesData = [
  {
    id: 1,
    title: "Workspace Solutions",
    slug: "workspace-solutions",
    description: "Executive work spaces at cost-effective prices.",
    longDescription: "Experience premium executive workspaces designed for productivity. We offer cost-effective solutions without compromising on quality or comfort, perfect for teams of all sizes.",
    stat: "Cost Effective",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
    icon: PhBriefcase,
    content: `
      <h3>ABB Co-working Space</h3>
      <p>We provide <strong>premium, flexible workspace</strong> at cost-effective prices by offering unrestricted access to our Tema and Airport City hubs. This guarantees a reliable infrastructure, including power and high-speed internet, in a professional environment, while integrating access to specialized networking communities.</p>
    `,
    workspaceSolutions: [
      {
        category: "Premium Offices",
        description: "Fully furnished, private, and secure dedicated office suites.",
        useCase: "Established companies or executives requiring the highest level of privacy and dedicated infrastructure."
      },
      {
        category: "Co-working Space",
        description: "Flexible, open-plan shared workspaces available on a membership or day rate basis.",
        useCase: "Freelancers, small teams, or budget-conscious professionals needing a daily professional setting."
      },
      {
        category: "Working Groups",
        description: "Bookable spaces tailored for larger structured business activities.",
        useCase: "Conferences, Training Rooms, and larger Team Meeting Spaces."
      }
    ]
  },
  {
    id: 2,
    title: "Virtual Office",
    slug: "virtual-office",
    description: "Primary or auxiliary business address locations.",
    longDescription: "Establish a professional presence with our virtual address services. Use our prime location as your primary or auxiliary business address to build trust with your clients.",
    stat: "Prime Location",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200",
    icon: PhMapPin,
    content: `
      <h3>Virtual Address System</h3>
      <p>We provide a primary or auxiliary address location by offering a <strong>professional, recognized address</strong> in Airport for formal registration and official correspondence. This system eliminates the credibility gap for new businesses and includes full mail handling, notification, and forwarding services. Benefits include:</p>
      <ul>
        <li><strong>Enhanced Credibility:</strong> Instantly gain a professional reputation with a recognized Airport City address.</li>
        <li><strong>Unmatched Flexibility:</strong> Benefit from cost-effective, flexible terms and unrestricted access to hubs.</li>
        <li><strong>Guaranteed Operational Reliability:</strong> Maintain uninterrupted productivity with robust infrastructure.</li>
      </ul>
    `,
    virtualOffices: [
      {
        feature: "Airport City Hub",
        benefit: "Formal registration and official correspondence."
      },
      {
        feature: "Official Registration Address",
        benefit: "Eliminates the credibility gap for new businesses and offshore entities."
      },
      {
        feature: "Full Mail Handling",
        benefit: "Secure reception and management of all physical mail and correspondence."
      },
      {
        feature: "Notification & Forwarding",
        benefit: "Prompt client notification of new mail, with secure forwarding services."
      }
    ]
  },
  {
    id: 3,
    title: "Masterclasses",
    slug: "masterclasses",
    description: "Refreshing insights from industry experts.",
    longDescription: "Join us every last Saturday of the month for refreshing insights and knowledge sharing from renowned experts and captains of industries to stay ahead of the curve.",
    stat: "Monthly Events",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
    icon: PhChalkboardTeacher,
    content: `
      <h3>Masterclass & Accelerated Training Programs</h3>
      <p>We provide refreshing insights from experts and captains of industries through innovative, effective, and <strong>customized training experiences</strong>. Our offerings are strategically segmented for different audiences.</p>
    `,
    masterclasses: [
      {
        audience: "Students (Startups/Entrepreneur)",
        focus: "Core business fundamentals (Financial Management, Pitching Skills)."
      },
      {
        audience: "Corporate (Working Professionals)",
        focus: "Advanced and specialized topics (M&A, Advanced Tax Strategy, Strategy & Growth Planning)."
      }
    ],
    features: [
      {
        title: "Standardized & General Curriculum",
        description: "Focus on core topics like Financial Management and Pitching Skills."
      },
      {
        title: "Customized Curriculum",
        description: "Tailored internal training for teams within an organization."
      },
      {
        title: "Executive & Advanced Clinics",
        description: "Delivered by C-suite executives on complex topics."
      }
    ]
  },
  {
    id: 4,
    title: "Business Advisory",
    slug: "business-advisory",
    description: "Digital marketing, public speaking, legal, and more.",
    longDescription: "Comprehensive advisory services covering digital marketing, public speaking, legal compliance, and other critical business areas to help you navigate challenges.",
    stat: "Expert Advice",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200",
    icon: PhStrategy,
    content: `
      <h3>Business Advisory Services</h3>
      <p>We provide relevant advisory services that formalize the strategic support offered, acting as a direct consultancy arm. These services cover critical areas:</p>
    `,
    features: [
      {
        title: "Strategy & Growth Planning",
        description: "(market entry, expansion, operational restructuring)."
      },
      {
        title: "Financial Structuring",
        description: "(optimal legal and financial setup, capital allocation)."
      },
      {
        title: "Funding Facilitation",
        description: "(preparing pitch decks, structuring deals, and connecting to grants, loans, and angel investors)."
      }
    ]
  },
  {
    id: 5,
    title: "Mentorship & Coaching",
    slug: "mentorship-coaching",
    description: "Expert pairing and guidance for business success.",
    longDescription: "We provide expert pairing and personalized guidance services to ensure your professional growth and business success through tailored mentorship programs.",
    stat: "1-on-1 Guidance",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200",
    icon: PhHandshake,
    content: `
      <h3>Mentorship & Coaching</h3>
      <p>We provide expert pairing and guidance services utilizing modern technology and proven executive experience for targeted guidance and accelerated strategic development. This includes:</p>
    `,
    features: [
      {
        title: "Executive Coaching",
        description: "For personalized, one-on-one guidance on advanced strategy and leadership development."
      },
      {
        title: "Executive Shadowing & Board Immersion",
        description: "For top founders to learn high-level governance and organizational structure firsthand."
      },
      {
        title: "Peer-to-Peer Learning",
        description: "Through structured group coaching and collaborative problem-solving."
      }
    ]
  },
  {
    id: 6,
    title: "CSR Outsourcing",
    slug: "csr-outsourcing",
    description: "360-degree solutions for your CSR initiatives.",
    longDescription: "Let us handle your Corporate Social Responsibility initiatives. We provide complete, 360-degree solutions to manage and execute your CSR impact effectively.",
    stat: "360° Solutions",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200",
    icon: PhGlobeHemisphereWest,
    content: `
      <h3>CSR Outsourcing (Corporate Social Responsibility)</h3>
      <p>We deliver a <strong>360-degree solution</strong> for all your CSR initiatives by allowing corporations to <strong>fully outsource</strong> their project execution to ABB. ABB takes on the responsibility to design, execute, and manage the projects, delivering successful and measurable results. This ensures our corporate partners <strong>celebrate the impact</strong> without being burdened by the operational hustle of execution.</p>
    `,
    features: [
      {
        title: "Impact Program Design & Execution",
        description: "We design, implement, and manage customized CSR programs focused on entrepreneurship, skill development, and community resilience that seamlessly align with your company's ESG goals (Environmental, Social, and Governance)."
      },
      {
        title: "Youth & Women Empowerment Focus",
        description: "We facilitate the direct channeling of CSR funds into ABB's pre-vetted portfolio of youth and women-led businesses, providing immediate, measurable impact in alignment with your public image."
      },
      {
        title: "Impact Reporting & Accountability",
        description: "We provide audited, detailed reports and media documentation to ensure full accountability. This allows your company to report on quantifiable social outcomes (e.g., jobs created, businesses scaled, SDGs supported) without managing the operational complexity"
      }
    ]
  },
  {
    id: 7,
    title: "Accelerator-Incubator",
    slug: "accelerator-incubator",
    description: "A blended model positioning you for growth.",
    longDescription: "Our unique blended accelerator-incubator model is the heart of who we are, positioning startups for rapid growth and sustainable success in a competitive market.",
    stat: "Growth Focused",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200",
    icon: PhRocketLaunch,
    content: `
      <h3>A Blended Accelerator-Incubator Model</h3>
      <p>ABB positions itself as a <strong>governance training ground</strong> and a <strong>hub for serious, growth-oriented founders</strong>. Our model is a hybrid that supports both early-stage businesses (The Founder) with services like the Virtual Address and core Masterclass training, as well as scaling companies (The Scaling CEO) requiring advanced strategy, Executive Coaching, and Business Advisory. We provide end-to-end support, moving beyond traditional training to deliver customized, specialized guidance from idea to advanced scale.</p>
    `
  }
];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ServicesSection",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: servicesContent } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "home-services",
      () => queryCollection("services").all(),
      { lazy: true }
    )), __temp = await __temp, __restore(), __temp);
    const services = computed(() => {
      const data = servicesContent.value || [];
      const sortedData = [...data].sort((a, b) => {
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      });
      return sortedData.map((s, index) => {
        const localMatch = servicesData.find((l) => l.slug === s.slug);
        const imageObj = Array.isArray(s.serviceImage) ? s.serviceImage[0] : s.serviceImage;
        const imageUrl = imageObj?.url || (localMatch?.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200");
        return {
          ...s,
          id: index + 1,
          // Normalize ID for UI (01, 02, etc)
          image: imageUrl,
          // Fallback content if missing
          description: s.shortDescription || s.description || localMatch?.description,
          longDescription: s.longDescription || localMatch?.longDescription,
          stat: s.stat || localMatch?.stat,
          // Icon mapping
          icon: localMatch?.icon
        };
      });
    });
    const activeServiceId = ref(1);
    const leftServices = computed(() => services.value.slice(0, 4));
    const rightServices = computed(() => services.value.slice(4, 7));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = ImageComponent;
      _push(`<div${ssrRenderAttrs(mergeProps({
        id: "services",
        class: "scroll-mt-20",
        style: { backgroundImage: "url(" + services.value[activeServiceId.value - 1]?.image + ")" }
      }, _attrs))} data-v-ccb0179f><section class="bg-black/60 py-20 backdrop-blur-md text-white overflow-hidden" data-v-ccb0179f><div class="container mx-auto px-4 md:px-6" data-v-ccb0179f><h2 class="text-3xl md:text-4xl lg:text-5xl text-center font-bold font-display text-white mb-6 leading-tight" data-v-ccb0179f> Our <span class="text-[#E60000]" data-v-ccb0179f>Services</span></h2><div class="grid lg:grid-cols-3 gap-8 items-start" data-v-ccb0179f><div class="flex flex-col space-y-4 order-2 lg:order-1" data-v-ccb0179f><!--[-->`);
      ssrRenderList(leftServices.value, (service) => {
        _push(`<div class="${ssrRenderClass([activeServiceId.value === service.id ? "bg-[#E60000] text-white shadow-lg scale-100" : "hover:bg-black/20 text-gray-400 hover:text-gray-200", "cursor-pointer group rounded-xl p-6 transition-all duration-300 border border-transparent"])}" data-v-ccb0179f><div class="flex flex-col sm:flex-row items-start gap-4" data-v-ccb0179f><span class="text-lg font-bold opacity-50 mt-1" data-v-ccb0179f>0${ssrInterpolate(service.id)}.</span><div data-v-ccb0179f><h3 class="${ssrRenderClass([activeServiceId.value === service.id ? "text-white" : "text-white group-hover:text-white", "text-xl font-bold mb-2"])}" data-v-ccb0179f>${ssrInterpolate(service.name)}</h3><p class="${ssrRenderClass([activeServiceId.value === service.id ? "text-white/90" : "text-gray-300 group-hover:text-gray-200", "text-sm leading-relaxed"])}" data-v-ccb0179f>${ssrInterpolate(service.description)}</p>`);
        if (activeServiceId.value === service.id) {
          _push(`<div class="lg:hidden mt-4 pt-4 border-t border-white/20" data-v-ccb0179f><p class="text-sm font-medium text-white/90 mb-4 leading-relaxed" data-v-ccb0179f>${ssrInterpolate(service.longDescription)}</p><div class="flex items-center justify-between gap-4 mb-4" data-v-ccb0179f><span class="text-2xl font-black text-white uppercase" data-v-ccb0179f>${ssrInterpolate(service.stat)}</span></div>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/services/${service.slug}`,
            class: "inline-flex items-center justify-center w-full px-6 py-3 text-sm font-bold text-[#E60000] bg-white rounded-full hover:bg-gray-100 transition-colors"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` View Details `);
              } else {
                return [
                  createTextVNode(" View Details ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      });
      _push(`<!--]--></div><div class="hidden lg:block relative h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl sticky top-24 order-1 lg:order-2 mb-8 lg:mb-0" data-v-ccb0179f><!--[-->`);
      ssrRenderList(services.value, (service) => {
        _push(`<div class="absolute inset-0 w-full h-full" style="${ssrRenderStyle(activeServiceId.value === service.id ? null : { display: "none" })}" data-v-ccb0179f>`);
        _push(ssrRenderComponent(_component_NuxtImg, {
          src: service.image,
          alt: service.title,
          class: "w-full h-full object-cover transition-transform duration-700 hover:scale-105",
          format: "webp",
          loading: "lazy"
        }, null, _parent));
        _push(`<div class="absolute bottom-4 left-4 right-4 p-6 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 overflow-hidden" data-v-ccb0179f><template>`);
        if (activeServiceId.value === service.id) {
          _push(`<div data-v-ccb0179f><p class="text-sm font-medium text-gray-100 mb-4 leading-relaxed line-clamp-3" data-v-ccb0179f>${ssrInterpolate(service.longDescription)}</p><div class="flex items-center justify-between gap-4" data-v-ccb0179f><span class="text-2xl font-black text-[#E60000] uppercase" data-v-ccb0179f>${ssrInterpolate(service.stat)}</span></div>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/services/${service.slug}`,
            class: "inline-flex items-center justify-center mt-4 w-full md:w-fit px-12 py-3 text-base font-bold text-white bg-[#E60000] rounded-full hover:bg-red-700 transition-colors"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` View Details `);
              } else {
                return [
                  createTextVNode(" View Details ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</template></div></div>`);
      });
      _push(`<!--]--></div><div class="flex flex-col space-y-4 order-3 lg:order-3" data-v-ccb0179f><!--[-->`);
      ssrRenderList(rightServices.value, (service) => {
        _push(`<div class="${ssrRenderClass([activeServiceId.value === service.id ? "bg-[#E60000] text-white shadow-lg scale-100" : "hover:bg-black/20 text-gray-400 hover:text-gray-200", "cursor-pointer group rounded-xl p-6 transition-all duration-300 border border-transparent"])}" data-v-ccb0179f><div class="flex flex-col sm:flex-row items-start gap-4" data-v-ccb0179f><span class="text-lg font-bold opacity-50 mt-1" data-v-ccb0179f>0${ssrInterpolate(service.id)}.</span><div data-v-ccb0179f><h3 class="${ssrRenderClass([activeServiceId.value === service.id ? "text-white" : "text-white group-hover:text-white", "text-xl font-bold mb-2"])}" data-v-ccb0179f>${ssrInterpolate(service.name)}</h3><p class="${ssrRenderClass([activeServiceId.value === service.id ? "text-white/90" : "text-gray-300 group-hover:text-gray-200", "text-sm leading-relaxed"])}" data-v-ccb0179f>${ssrInterpolate(service.description)}</p>`);
        if (activeServiceId.value === service.id) {
          _push(`<div class="lg:hidden mt-4 pt-4 border-t border-white/20" data-v-ccb0179f><p class="text-sm font-medium text-white/90 mb-4 leading-relaxed" data-v-ccb0179f>${ssrInterpolate(service.longDescription)}</p><div class="flex items-center justify-between gap-4 mb-4" data-v-ccb0179f><span class="text-2xl font-black text-white uppercase" data-v-ccb0179f>${ssrInterpolate(service.stat)}</span></div>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/services/${service.slug}`,
            class: "inline-flex items-center justify-center w-full px-6 py-3 text-sm font-bold text-[#E60000] bg-white rounded-full hover:bg-gray-100 transition-colors"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` View Details `);
              } else {
                return [
                  createTextVNode(" View Details ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      });
      _push(`<!--]--></div></div></div></section></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ServicesSection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ServicesSection = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-ccb0179f"]]), { __name: "ServicesSection" });
const __nuxt_component_0_lazy = defineAsyncComponent(() => import('./AdditionalServices-BGHZLjjQ.mjs').then((c) => c.default || c));
const __nuxt_component_1_lazy = defineAsyncComponent(() => import('./MembershipBenefits-Dc5B54c-.mjs').then((c) => c.default || c));
const __nuxt_component_2_lazy = defineAsyncComponent(() => import('./PartnersSection-CcwuDcSw.mjs').then((c) => c.default || c));
const __nuxt_component_3_lazy = defineAsyncComponent(() => import('./TeamSection-B2KdciyH.mjs').then((c) => c.default || c));
const __nuxt_component_4_lazy = defineAsyncComponent(() => import('./TestimonialSection-CH78RF-v.mjs').then((c) => c.default || c));
const __nuxt_component_5_lazy = defineAsyncComponent(() => import('./CTASection-BJAsNOtr.mjs').then((c) => c.default || c));
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Providing businesses with training, talent management and business support services in Ghana and Africa",
      description: "Africa Business Bureau offers you a 360° Launchpad for Growth in Ghana and Africa. We provide businesses with training, talent management, and business support services to incubate their business ideas and accelerate growth."
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LazyAdditionalServices = __nuxt_component_0_lazy;
      const _component_LazyMembershipBenefits = __nuxt_component_1_lazy;
      const _component_LazyPartnersSection = __nuxt_component_2_lazy;
      const _component_LazyTeamSection = __nuxt_component_3_lazy;
      const _component_LazyTestimonialSection = __nuxt_component_4_lazy;
      const _component_LazyCTASection = __nuxt_component_5_lazy;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_sfc_main$4, null, null, _parent));
      _push(ssrRenderComponent(AboutSection, null, null, _parent));
      _push(ssrRenderComponent(ServicesSection, null, null, _parent));
      _push(ssrRenderComponent(_component_LazyAdditionalServices, null, null, _parent));
      _push(ssrRenderComponent(_component_LazyMembershipBenefits, null, null, _parent));
      _push(ssrRenderComponent(_component_LazyPartnersSection, null, null, _parent));
      _push(ssrRenderComponent(_component_LazyTeamSection, null, null, _parent));
      _push(ssrRenderComponent(_component_LazyTestimonialSection, null, null, _parent));
      _push(ssrRenderComponent(_component_LazyCTASection, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DD4fY19h.mjs.map
