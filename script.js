document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileNav();
    initNeuralBackground();
    initStatCounters();
    initServiceTabs();
    initContactForm();
    initGlobalization();
    initCookieBanner();
});

/* --- HubSpot Header Sticky Scroll Trigger --- */
function initHeader() {
    const wrapper = document.querySelector('.header-nav-wrapper');
    if (!wrapper) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            wrapper.classList.add('scrolled');
        } else {
            wrapper.classList.remove('scrolled');
        }
    });
}

/* --- Mobile Menu Navigation Drawer --- */
function initMobileNav() {
    const toggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const spans = toggle.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

/* --- Interactive Neural Background Canvas --- */
function initNeuralBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const maxParticles = width < 768 ? 35 : 80;
    const connectionDistance = 110;
    let mouse = { x: null, y: null, radius: 140 };

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x += (dx / dist) * force * 1.2;
                    this.y += (dy / dist) * force * 1.2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(92, 46, 145, 0.2)'; 
            ctx.fill();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    const alpha = (1 - dist / connectionDistance) * 0.08; 
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(92, 46, 145, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* --- Animated Stat Counters on Scroll --- */
function initStatCounters() {
    const stats = document.querySelectorAll('.stat-num');
    if (stats.length === 0) return;

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetVal = parseInt(target.getAttribute('data-target'), 10);
                const suffix = target.getAttribute('data-suffix') || '';
                let count = 0;
                const speed = 2000 / targetVal;

                const updateCount = () => {
                    const increment = Math.ceil(targetVal / 100);
                    if (count < targetVal) {
                        count += increment;
                        if (count > targetVal) count = targetVal;
                        target.innerText = count + suffix;
                        setTimeout(updateCount, speed * increment);
                    } else {
                        target.innerText = targetVal + suffix;
                    }
                };

                updateCount();
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

/* --- Service Tabs Filter (For services.html) --- */
function initServiceTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    if (tabButtons.length === 0) return;

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetEl = document.getElementById(targetTab);
            if (targetEl) targetEl.classList.add('active');
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const activeTabParam = urlParams.get('tab');
    if (activeTabParam) {
        const paramBtn = document.querySelector(`.tab-btn[data-tab="${activeTabParam}"]`);
        if (paramBtn) {
            paramBtn.click();
            const tabsContainer = document.querySelector('.services-tabs-container');
            if (tabsContainer) {
                tabsContainer.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
}

/* --- Contact Form Submission Handler --- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const feedback = document.getElementById('formFeedback');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const service = document.getElementById('service').value;
        const msg = document.getElementById('message').value.trim();

        const currentLang = localStorage.getItem('selectedLanguage') || 'en';

        if (!name || !email || !msg) {
            showFeedback(getAlertText('fillRequired', currentLang), 'error');
            return;
        }

        if (!validateEmail(email)) {
            showFeedback(getAlertText('invalidEmail', currentLang), 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const origText = submitBtn.innerText;
        submitBtn.disabled = true;
        submitBtn.innerText = getAlertText('sending', currentLang);

        setTimeout(() => {
            showFeedback(getAlertText('successMsg', currentLang), 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerText = origText;
        }, 1500);
    });

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    function showFeedback(text, type) {
        feedback.innerText = text;
        feedback.className = `form-feedback ${type}`;
        if (type === 'error') {
            setTimeout(() => {
                feedback.className = 'form-feedback';
            }, 5000);
        }
    }

    function getAlertText(key, lang) {
        const alerts = {
            en: {
                fillRequired: 'Please fill in all required fields.',
                invalidEmail: 'Please provide a valid email address.',
                sending: 'Transmitting Project Inquiry...',
                successMsg: 'Project request transmitted successfully! A Yelagiri Infotech principal architect will follow up within 2 hours.'
            },
            fr: {
                fillRequired: 'Veuillez remplir tous les champs obligatoires.',
                invalidEmail: 'Veuillez fournir une adresse e-mail valide.',
                sending: 'Transmission de la demande de projet...',
                successMsg: 'Demande de projet transmise avec succès ! Un architecte principal de Yelagiri Infotech vous contactera dans les 2 heures.'
            },
            es: {
                fillRequired: 'Por favor, rellene todos los campos obligatorios.',
                invalidEmail: 'Por favor, proporcione una dirección de correo electrónico válida.',
                sending: 'Transmitiendo consulta de proyecto...',
                successMsg: '¡Consulta de proyecto transmitida con éxito! Un arquitecto principal de Yelagiri Infotech se comunicará en menos de 2 horas.'
            }
        };
        return alerts[lang][key];
    }
}

/* --- Cookie Consent Banner --- */
function initCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('cookieAcceptBtn');
    const declineBtn = document.getElementById('cookieDeclineBtn');
    if (!banner) return;

    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        setTimeout(() => {
            banner.classList.add('show');
        }, 1000);
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.classList.remove('show');
    });

    declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        banner.classList.remove('show');
    });
}

/* --- Globalization & i18n Translation Dictionary --- */
const translations = {
    en: {
        // Navigation (HubSpot Inspired)
        navHome: "Home",
        navServices: "Services",
        navDomains: "Domains",
        navAbout: "About Us",
        navContact: "Consultation",
        navCareers: "Careers",
        
        // Cookie Banner
        cookieText: "We use cookies to analyze traffic, manage secure transactions, and personalize your experience. By clicking accept, you consent to our use of cookies.",
        cookieAccept: "Accept Cookies",
        cookieDecline: "Decline",

        // Footer common
        footerDesc: "Providing premier custom software development, IT consulting, and secure AI engineering services. Helping enterprise organizations scale securely with technical excellence.",
        footerServicesTitle: "Engineering Services",
        footerDomainsTitle: "Target Domains",
        footerNewsletterTitle: "Stay Updated",
        footerNewsletterP: "Subscribe to our newsletter for insights on IT strategy and AI engineering trends.",
        footerNewsletterBtn: "Join",
        footerNewsletterPlaceholder: "Enter business email",
        footerCopyright: "© 2026 Yelagiri Infotech (OPC). All rights reserved. Built with technical excellence.",
        addressRegisteredLabel: "Registered Office:",
        addressBranchLabel: "Branch Office:",

        // HOME PAGE (index.html)
        heroBadge: "Beyond Transactions: Building Engagement",
        heroTitle: "Engineering Intelligence. Building Products That Last.",
        heroDesc: "At Yelagiri Infotech, we build custom cloud solutions that solve complex operations. We deliver next-generation ecommerce systems, automated Field Services software, robust SAAS products, specialized mobile apps and tailored Large Language Model integrations to prepare your business for the cognitive era.",
        heroCtaPrimary: "Start Your Project",
        heroCtaSecondary: "Explore Services",
        statUptimeLabel: "System SLA Uptime",
        statClientsLabel: "Enterprises Scaled",
        statLlmLabel: "Cognitive AI Engines",
        statAssessLabel: "Objective Evaluations",
        philBadge: "Engineering Excellence",
        philTitle: "Coupling Advanced Engineering with Strategic Foresight",
        philText1: "Modern businesses face a dual challenge: maintaining robust, scalable daily operations while quickly adopting artificial intelligence to secure market leadership. Yelagiri Infotech bridges this gap.",
        philText2: "We don't believe in generic, out-of-the-box software wrappers. We design, architect, and deploy clean, bespoke microservice architectures that seamlessly connect into your existing systems. By prioritizing raw performance, strict data compliance, and flexible cloud designs, we help you transform operational expenses into long-term assets.",
        philBtn: "Learn Our Philosophy",
        philFeatTitle1: "Scalable Cloud Foundation",
        philFeatDesc1: "All solutions are constructed using resilient cloud-native technologies, supporting millions of transactions with ease.",
        philFeatTitle2: "Secure-by-Design Artificial Intelligence",
        philFeatDesc2: "We integrate LLM and neural architectures keeping intellectual property protection and private hosting at the forefront.",
        philFeatTitle3: "Validated Quality Assurance",
        philFeatDesc3: "Every project undergoes rigorous, continuous software testing to ensure perfect functional output and fast performance profiles.",
        servBadge: "Capabilities",
        servTitle: "Bespoke Software Services",
        servDesc: "Discover our core software capabilities designed to elevate every department of your enterprise.",
        servCardTitle1: "Cloud ERP Systems",
        servCardDesc1: "Bespoke Enterprise Resource Planning software developed to centralize supply chains, financial auditing, inventory pools, and personnel workflows. Built for massive transactional throughput.",
        servCardLink1: "Learn More",
        servCardTitle2: "Field Services Software",
        servCardDesc2: "End-to-end mobile dispatch platforms featuring dynamic GPS routing, offline functionality, real-time job allocation, and telemetry integrations for distributed field assets.",
        servCardLink2: "Learn More",
        servCardTitle3: "Custom LLM & AI",
        servCardDesc3: "Production-grade Large Language Model implementations, Retrieval-Augmented Generation (RAG) databases, and agentic workflows tuned to proprietary business documents.",
        servCardLink3: "Learn More",
        servCardTitle4: "E-Commerce Platforms",
        servCardDesc4: "Customized, high-performance E-Commerce engines built to sustain massive seasonal traffic spikes and facilitate frictionless buying journeys. Headless design ensures agility.",
        servCardLink4: "Learn More",
        ctaTitle: "Ready to Engineer Your Competitive Edge?",
        ctaDesc: "Connect with Yelagiri Infotech's architects today. Let us structure a clear technical strategy or build a prototype that demonstrates immediate operational ROI.",
        ctaBtn: "Schedule Strategic Review",

        // SERVICES PAGE (services.html)
        servicesHeadBadge: "Capabilities Matrix",
        servicesHeadTitle: "Our Software Engineering Offerings",
        servicesHeadDesc: "We provide full-lifecycle software engineering and AI implementation. Explore our core service verticals below.",
        tabErpBtn: "Enterprise ERP",
        tabFieldBtn: "Field Services",
        tabStrategyBtn: "Tech Strategy",
        tabTestingBtn: "E-Commerce Platforms",
        tabLlmBtn: "LLM & Generative AI",
        erpTitle: "Next-Generation Enterprise Resource Planning (ERP)",
        erpDesc1: "Modern operations require real-time transparency. Our custom ERP solutions unify complex operational threads into a single, cohesive digital platform. Instead of heavy, rigid legacy setups, we engineer flexible, event-driven web environments custom-built for your specific business rules.",
        erpDesc2: "We specialize in integrating inventory sync, automated supply chain forecasting, real-time ledgers, and multi-currency billing engines. Our architectures rely on robust API layers, database optimization (PostgreSQL/Redis), and secure containerized infrastructure to handle sudden peaks in transactions without delay.",
        erpBullet1: "Automated inventory reconciliation and live ledger bookkeeping.",
        erpBullet2: "Advanced vendor order placement workflows and supply-chain predictive planning.",
        erpBullet3: "Granular role-based access control (RBAC) and audit logging for security compliance.",
        erpBullet4: "Integration support for older accounting, shipping, and CRM software.",
        fieldTitle: "Intelligent Field Services Platforms",
        fieldDesc1: "Managing field workers requires instant coordination and smart data synchronization. Yelagiri Infotech designs and builds comprehensive field service platforms that keep dispatchers and field engineers in constant alignment.",
        fieldDesc2: "At the heart of our field platforms is a custom routing engine that analyzes traffic patterns, technician skill sets, and job locations to optimize travel schedules. Our mobile client apps are built with offline-first synchronization capabilities, allowing field technicians to view repair manuals, capture customer signatures, and log inventory use even in low-signal areas, syncing immediately when back online.",
        fieldBullet1: "Algorithmic route optimization and live GPS location sharing.",
        fieldBullet2: "Mobile client applications featuring offline SQLite databases.",
        fieldBullet3: "Interactive dispatcher console with drag-and-drop scheduling calendars.",
        fieldBullet4: "Automated client notification workflows via SMS and email.",
        stratTitle: "Technical Strategy & Architecture Consulting",
        stratDesc1: "Poor architectural planning can quickly limit enterprise growth. Our technology strategy consultants perform deep system reviews to identify performance bottlenecks, single points of failure, and security risks in your software stack.",
        stratDesc2: "We assist executive teams in mapping out secure cloud migrations, refactoring monolithic code into highly scalable microservices, and assessing AI readiness. We provide practical, step-by-step development paths that ensure your software infrastructure scales cost-effectively alongside your growing user base.",
        stratBullet1: "Monolith-to-microservice migration plans and serverless designs.",
        stratBullet2: "Multi-cloud cost optimization plans (AWS, GCP, Azure).",
        stratBullet3: "Disaster recovery planning, database backup policies, and system failover strategies.",
        stratBullet4: "Corporate AI readiness workshops and technical vendor evaluation.",
        testTitle: "Scalable E-Commerce & Retail Engine Platforms",
        testDesc1: "We engineer customized, high-performance E-Commerce engines built to sustain massive seasonal traffic spikes and facilitate frictionless buying journeys. Our systems decouple frontend interfaces from backend processes for increased security and agility.",
        testDesc2: "From multi-vendor shopping portals to custom merchant integrations, we embed secure checkout processing, automated taxation algorithms, real-time inventory pooling, and predictive recommendations to increase conversion metrics.",
        testBullet1: "Custom shopping cart checkout and secure multi-currency payments.",
        testBullet2: "Headless commerce architecture with GraphQL APIs.",
        testBullet3: "Real-time multi-warehouse inventory reconciliation.",
        testBullet4: "AI-powered product recommendations and user cart tracking.",
        llmTitle: "Private LLM Deployment & AI Agent Engineering",
        llmDesc1: "Moving past generic chat interfaces, we build custom Large Language Model (LLM) workflows that connect directly with your company's data. We design secure Retrieval-Augmented Generation (RAG) structures, enabling employees and customers to query complex knowledge bases with near-zero hallucinations.",
        llmDesc2: "By using vector databases (like Pinecone, Milvus, or PGVector) and open-source models (Llama-3, Mistral, Qwen) hosted locally or in private clouds, we ensure your operational data never leaves your secure boundary. We also design autonomous AI agents that can handle multi-step back-office processing tasks.",
        llmBullet1: "Bespoke RAG engines utilizing high-performance vector search databases.",
        llmBullet2: "Fine-tuning models on proprietary document repositories and custom terminology.",
        llmBullet3: "Autonomous agent design for database queries and email ticketing workflows.",
        llmBullet4: "System integrations using orchestration tools like LangChain and LlamaIndex.",
        servicesCtaTitle: "Need a Tailored Technical Architecture?",
        servicesCtaDesc: "Our engineering leads are ready to review your requirements. Contact us to receive an initial high-level blueprint matching your operational goals.",
        servicesCtaBtn: "Request Engineering Brief",

        // DOMAINS PAGE (domains.html)
        domainsHeadBadge: "Industry Verticals",
        domainsHeadTitle: "Sectors We Empower",
        domainsHeadDesc: "Generic tools don't solve complex industry problems. We develop software tailored for specific domain rules, data structures, and regulatory environments.",
        domTitle1: "Omnichannel Retail & Intelligent Supply Chain",
        domDesc1_1: "Modern retailers operate across physical stores, mobile apps, and third-party marketplaces. Keeping inventory and pricing synced across all these channels is a common operational hurdle.",
        domDesc1_2: "Yelagiri Infotech builds secure, high-throughput retail networks that process real-time sales data across millions of stock units. We deploy smart pricing engines that analyze customer interest, supply levels, and shipping times to adjust promotions dynamically. Our systems sync inventory pools instantly, avoiding double-sales and helping warehouse teams prepare orders quickly.",
        domTech1: "Key Technologies: Event-driven pub/sub messaging, distributed stock ledgers, predictive demand algorithms, and custom Point of Sale (POS) API wrappers.",
        domTitle2: "Transparent Procurement & Dynamic Bidding",
        domDesc2_1: "Large-scale industrial procurement requires high transparency, auditability, and speed. Manual cost estimations and slow bidding portals can lead to project delays and budget overruns.",
        domDesc2_2: "We engineer secure, multi-criteria bidding platforms that automate vendor evaluations. Our systems process incoming proposals, parse pricing line items, and run compliance checks using objective criteria. With secure audit logging and cryptographic verification, we prevent tampering, ensuring fair competition and reliable vendor selections for enterprise buyers.",
        domTech2: "Key Technologies: Secure cryptographic hashing, automated document parsing pipelines, multi-criteria auction algorithms, and real-time WebSocket bidding tickers.",
        domTitle3: "Distributed Field Service Operations",
        domDesc3_1: "Managing complex field operations—like utilities repair, industrial installs, and home maintenance—requires quick dispatch coordination and reliable mobile data management.",
        domDesc3_2: "Our field service systems combine dispatcher dashboards with lightweight mobile applications for field crews. Dispatchers benefit from auto-scheduling tools that match travel routes and job priority with technician skills. Field technicians can access technical manuals, check inventory levels, and sign off on completed work without internet connectivity, syncing updates automatically once reconnected.",
        domTech3: "Key Technologies: GPS tracking API integrations, offline-first client storage (IndexedDB/SQLite), and auto-allocation engines based on technician qualifications.",
        domTitle4: "Objective Education Assessment & Evaluation",
        domDesc4_1: "Traditional educational grading systems can be subjective and slow, limiting the feedback loop between teaching and learning. Assessing specific student skills at scale requires structured, data-driven tools.",
        domDesc4_2: "Yelagiri Infotech designs and builds objective assessment engines used by schools, universities, and professional licensing boards. Our software structures evaluations based on clear learning goals (aligned with frameworks like Bloom's Taxonomy). The platform offers automated, secure exam delivery, cheat-prevention features, and analytics dashboards that pinpoint learning gaps for teachers and curriculum designers.",
        domTech4: "Key Technologies: Adaptive testing algorithms, Bloom's Taxonomy learning classifiers, secure lock-down test environments, and learning analytics pipelines.",
        domainsCtaTitle: "Have a Unique Domain Requirement?",
        domainsCtaDesc: "Our engineering teams have experience building custom platforms across regulated industries. Share your workflows, and we will outline a custom software approach.",
        domainsCtaBtn: "Consult with a Domain Expert",

        // ABOUT PAGE (about.html)
        aboutHeadBadge: "Our Identity",
        aboutHeadTitle: "Yelagiri Infotech (OPC)",
        aboutHeadDesc: "Building high-performing, custom software foundations that support enterprise growth.",
        aboutMissionTitle: "Our Mission: Transforming Business Through AI and Technical Excellence",
        aboutMissionDesc1: "Founded on the principle that software should be treated as core company assets rather than temporary expenses, Yelagiri Infotech designs and builds high-quality software solutions. We partner with forward-thinking enterprises to modernize outdated systems and integrate secure, private artificial intelligence.",
        aboutMissionDesc2: "We avoid quick workarounds and generic software templates. Our engineers approach every challenge with fresh perspectives and deep technical knowledge. From our design practices to the final deployment steps, we build systems that handle millions of transactions, remain fully secure, and scale easily.",
        aboutIpTitle: "IP Protection & Authentic Solutions",
        aboutIpDesc1: "We believe that custom enterprise software must be truly unique. That is why Yelagiri Infotech guarantees complete originality across all source code, database structures, and written documentation we deliver.",
        aboutIpDesc2: "Every software architecture we design is built from the ground up to address your specific operational needs. We never copy code patterns from other projects or rely on third-party licenses that could expose your business to legal risks. When you partner with us, your custom platforms remain entirely your intellectual property.",
        aboutPillarTitle: "Core Operational Pillars",
        aboutPillarHead1: "Bespoke Architectures",
        aboutPillarDesc1: "Tailored designs optimized for your specific performance metrics, with no generic templates.",
        aboutPillarHead2: "Complete IP Transfer",
        aboutPillarDesc2: "Full ownership of custom source code transferred to your enterprise upon delivery.",
        aboutPillarHead3: "Continuous QA Verification",
        aboutPillarDesc3: "Continuous automated testing guarantees system speed and reliability at scale.",
        aboutDevTitle: "Our Development Quality Standards",
        aboutDevDesc: "We build systems that are designed to last, using reliable technologies and clear engineering processes.",
        aboutCardTitle1: "Performance Engineering",
        aboutCardDesc1: "We design systems with low-latency APIs, optimized database queries, and caching structures to handle sudden traffic peaks without slowdowns.",
        aboutCardTitle2: "Secure AI Deployments",
        aboutCardDesc2: "We set up custom LLMs and RAG pipelines inside private virtual networks to ensure your proprietary company data remains secure.",
        aboutCardTitle3: "Continuous QA Auditing",
        aboutCardDesc3: "We integrate automated testing directly into the build pipeline, catching bugs early to maintain high system reliability.",

        // CONTACT PAGE (contact.html)
        contactHeadBadge: "Collaborate",
        contactHeadTitle: "Connect with our Architects",
        contactHeadDesc: "Discuss your project scope, request an infrastructure review, or outline custom AI integration needs.",
        contactSideTitle: "Let's Build Something Premium",
        contactSideDesc: "Our engineering team handles complex, custom software builds. Submit your requirements, and a consultant will follow up to arrange a strategic review.",
        contactSideItemTitle1: "Corporate Inquiry",
        contactSideItemTitle2: "Response SLA Assurance",
        contactSideItemDesc2: "All enterprise strategy inquiries receive a response from a lead developer within 2 business hours.",
        contactSideItemTitle3: "Registered Office",
        contactSideItemDesc3: "Yelagiri Infotech (OPC). SP-7A Guindy Industrial Estate SIDCO, Chennai - 600032, Tamil Nadu, India.",
        contactSideItemTitle4: "Branch Office",
        contactSideItemDesc4: "NO 1209/2, Sai Imperia Grand, Mettupalayam Road, Saibaba Colony, Coimbatore, Tamil Nadu 641011",
        labelName: "Your Name *",
        labelEmail: "Business Email *",
        labelCompany: "Organization Name",
        labelService: "Service of Interest *",
        selectServiceDefault: "Select service area",
        optErp: "Enterprise Cloud ERP Systems",
        optField: "Field Services Sync Solutions",
        optStrategy: "Technical Strategy Consulting",
        optTesting: "E-Commerce Platforms",
        optLlm: "Custom LLM & Private AI Engines",
        optOther: "Bespoke Software Engineering",
        labelBudget: "Estimated Project Scope / Budget",
        optBudget1: "Discovery Audit & Architecture Strategy",
        optBudget2: "Pilot Implementation / MVP ($25k - $50k)",
        optBudget3: "Enterprise System Deployment ($50k - $150k)",
        optBudget4: "Custom Multi-Year Scaling (Above $150k)",
        labelMessage: "Project Scope & Core Operational Goals *",
        placeholderMessage: "Describe the operational bottlenecks you are looking to solve and your target domain (Retail, Bidding, Field Services, Education)...",
        btnSubmit: "Submit Project Request",

        // CAREERS PAGE (careers.html [NEW])
        careersHeadBadge: "Join Our Team",
        careersHeadTitle: "Build the Future of Enterprise Technology",
        careersHeadDesc: "At Yelagiri Infotech, we cultivate an engineering-first culture focused on technical excellence, secure private AI engineering, and scalable products.",
        careersCultureTitle: "Why Yelagiri Infotech?",
        careersCultureDesc: "We believe in hiring talented individuals who are passionate about solving complex enterprise problems. We offer complete IP ownership transfer structures for client projects, meaning you work on unique code bases built from scratch using clean microservices, modern cloud-native systems, and vector database architectures.",
        careersApplyTitle: "Open Positions & How to Apply",
        careersApplyDesc: "We maintain a streamlined, direct recruitment workflow. All of our active open positions, software engineering internships, and AI research vacancies are published exclusively through LinkedIn and major job portals. We do not accept unsolicited email applications for unlisted roles.",
        careersApplyBtn: "Check Openings on LinkedIn"
    },
    fr: {
        // Navigation
        navHome: "Accueil",
        navServices: "Services",
        navDomains: "Secteurs",
        navAbout: "À Propos",
        navContact: "Consultation",
        navCareers: "Carrières",
        
        // Cookie Banner
        cookieText: "Nous utilisons des cookies pour analyser le trafic, gérer les transactions sécurisées et personnaliser votre expérience. En cliquant sur accepter, vous consentez à notre utilisation des cookies.",
        cookieAccept: "Accepter",
        cookieDecline: "Décliner",

        // Footer common
        footerDesc: "Fournir des services de développement de logiciels personnalisés de premier plan, de conseil en informatique et d'ingénierie d'IA sécurisée. Aider les entreprises à évoluer avec une excellence technique.",
        footerServicesTitle: "Services d'ingénierie",
        footerDomainsTitle: "Secteurs Cibles",
        footerNewsletterTitle: "Restez Informé",
        footerNewsletterP: "Abonnez-vous à notre newsletter pour obtenir des informations sur la stratégie informatique et les tendances en IA.",
        footerNewsletterBtn: "S'inscrire",
        footerNewsletterPlaceholder: "Entrez l'adresse e-mail",
        footerCopyright: "© 2026 Yelagiri Infotech (OPC). Tous droits réservés. Construit avec excellence technique.",
        addressRegisteredLabel: "Siège social :",
        addressBranchLabel: "Succursale :",

        // HOME PAGE (index.html)
        heroBadge: "Au‑delà des transactions : créer l’engagement",
        heroTitle: "Ingénierie de l'intelligence. Créer des produits durables.",
        heroDesc: "Chez Yelagiri Infotech, nous construisons des solutions cloud sur mesure pour résoudre les opérations complexes. Nous fournissent des systèmes e-commerce de nouvelle génération, des logiciels automatisés de services sur le terrain, des produits SAAS robustes, des applications mobiles spécialisées et des intégrations de grands modèles de langage sur mesure pour préparer votre entreprise à l'ère cognitive.",
        heroCtaPrimary: "Démarrer votre projet",
        heroCtaSecondary: "Explorer les services",
        statUptimeLabel: "Disponibilité SLA du système",
        statClientsLabel: "Entreprises accompagnées",
        statLlmLabel: "Moteurs d'IA cognitive",
        statAssessLabel: "Évaluations objectives",
        philBadge: "Excellence en ingénierie",
        philTitle: "Associer l'ingénierie avancée à la vision stratégique",
        philText1: "Les entreprises modernes sont confrontées à un double défi : maintenir des opérations quotidiennes robustes et évolutives tout en adoptant rapidement l'intelligence artificielle pour garantir leur leadership sur le marché. Yelagiri Infotech comble ce fossé.",
        philText2: "We don't believe in generic, out-of-the-box software wrappers. We design, architect, and deploy clean, bespoke microservice architectures that seamlessly connect into your existing systems. By prioritizing raw performance, strict data compliance, and flexible cloud designs, we help you transform operational expenses into long-term assets.",
        philBtn: "Découvrir notre philosophie",
        philFeatTitle1: "Base Cloud Évolutive",
        philFeatDesc1: "Toutes nos solutions sont construites à l'aide de technologies cloud natives résilientes, prenant en charge des millions de transactions en toute simplicité.",
        philFeatTitle2: "Intelligence Artificielle Sécurisée",
        philFeatDesc2: "Nous intégrons des architectures LLM et neuronales en gardant la protection de la propriété intellectuelle et l'hébergement privé au premier plan.",
        philFeatTitle3: "Assurance Qualité Validée",
        philFeatDesc3: "Chaque projet fait l'objet de tests logiciels rigoureux et continus afin de garantir un fonctionnement parfait et des performances optimales.",
        servBadge: "Capacités",
        servTitle: "Services logiciels sur mesure",
        servDesc: "Découvrez nos capacités logicielles fondamentales conçues pour élever chaque département de votre entreprise.",
        servCardTitle1: "Systèmes ERP Cloud",
        servCardDesc1: "Bespoke Enterprise Resource Planning software developed to centralize supply chains, financial auditing, inventory pools, and personnel workflows. Built for massive transactional throughput.",
        servCardLink1: "En savoir plus",
        servCardTitle2: "Logiciels de services sur le terrain",
        servCardDesc2: "End-to-end mobile dispatch platforms featuring dynamic GPS routing, offline functionality, real-time job allocation, and telemetry integrations for distributed field assets.",
        servCardLink2: "En savoir plus",
        servCardTitle3: "IA et LLM sur mesure",
        servCardDesc3: "Production-grade Large Language Model implementations, Retrieval-Augmented Generation (RAG) databases, and agentic workflows tuned to proprietary business documents.",
        servCardLink3: "En savoir plus",
        servCardTitle4: "Plateformes E-Commerce",
        servCardDesc4: "Moteurs e-commerce sur mesure à haute performance, bâtis pour supporter les pics de trafic saisonniers et offrir des parcours d'achat sans friction.",
        servCardLink4: "En savoir plus",
        ctaTitle: "Prêt à concevoir votre avantage concurrentiel ?",
        ctaDesc: "Contactez les architectes de Yelagiri Infotech dès aujourd'hui. Laissez-nous concevoir une stratégie technique claire ou construire un prototype démontrant un retour sur investissement rapide.",
        ctaBtn: "Planifier un examen stratégique",

        // SERVICES PAGE (services.html)
        servicesHeadBadge: "Matrice de Capacités",
        servicesHeadTitle: "Nos Offres d'Ingénierie Logicielle",
        servicesHeadDesc: "Nous fournissons une ingénierie logicielle de cycle de vie complet et des implémentations d'IA. Explorez nos secteurs d'activité clés ci-dessous.",
        tabErpBtn: "ERP d'Entreprise",
        tabFieldBtn: "Services Terrain",
        tabStrategyBtn: "Stratégie Tech",
        tabTestingBtn: "Plateformes E-Commerce",
        tabLlmBtn: "LLM & IA Générative",
        erpTitle: "Planification des Ressources d'Entreprise (ERP) de Nouvelle Génération",
        erpDesc1: "Les opérations modernes nécessitent une transparence en temps réel. Nos solutions ERP personnalisées unifient les flux opérationnels complexes dans une plateforme numérique unique. Au lieu de structures anciennes et rigides, nous concevons des environnements web flexibles et orientés événements, adaptés à vos règles métier.",
        erpDesc2: "Nous nous spécialisons dans l'intégration de la synchronisation des stocks, la prévision automatisée des approvisionnements, les registres en temps réel et les moteurs de facturation multidevises. Nos architectures s'appuient sur des API robustes, l'optimisation des bases de données (PostgreSQL/Redis) et une infrastructure conteneurisée sécurisée pour gérer les pics de transactions.",
        erpBullet1: "Rapprochement automatisé des stocks et comptabilité en temps réel.",
        erpBullet2: "Flux de commande fournisseurs avancés et planification prédictive de la chaîne d'approvisionnement.",
        erpBullet3: "Contrôle d'accès basé sur les rôles (RBAC) et journaux d'audit pour la conformité.",
        erpBullet4: "Intégration d'anciens logiciels de comptabilité, d'expédition et de CRM.",
        fieldTitle: "Plateformes Intelligentes de Services sur le Terrain",
        fieldDesc1: "La gestion des équipes terrain nécessite une coordination instantanée et une synchronisation fiable des données. Yelagiri Infotech conçoit des plateformes de services sur le terrain qui alignent en permanence répartiteurs et techniciens.",
        fieldDesc2: "Nos plateformes intègrent un moteur de routage personnalisé qui analyse le trafic, les compétences des techniciens et la localisation des tâches. Nos applications mobiles disposent de capacités de synchronisation hors ligne, permettant de consulter les manuels et de signer les rapports d'intervention sans connexion, avec synchronisation dès le retour du réseau.",
        fieldBullet1: "Optimisation algorithmique des itinéraires et partage de position GPS.",
        fieldBullet2: "Applications mobiles avec bases de données SQLite hors ligne.",
        fieldBullet3: "Console de répartition interactive avec plannings en glisser-déposer.",
        fieldBullet4: "Automated client notification workflows via SMS and email.",
        stratTitle: "Technical Strategy & Architecture Consulting",
        stratDesc1: "Une mauvaise planification architecturale limite rapidement la croissance de l'entreprise. Nos consultants analysent vos systèmes pour identifier les goulots d'étranglement, les points de défaillance uniques et les risques de sécurité.",
        stratDesc2: "Nous aidons les équipes dirigeantes à planifier des migrations cloud sécurisées, à restructurer les codes monolithiques en microservices évolutifs et à évaluer la maturité IA. Nous fournissons des feuilles de route concrètes pour faire évoluer votre infrastructure logicielles au meilleur coût.",
        stratBullet1: "Feuilles de route de migration vers les microservices et conceptions serverless.",
        stratBullet2: "Optimisation des coûts multi-cloud (AWS, GCP, Azure).",
        stratBullet3: "Plans de reprise d'activité, politiques de sauvegarde et stratégies de basculement.",
        stratBullet4: "Ateliers de préparation à l'IA d'entreprise et évaluation de fournisseurs techniques.",
        testTitle: "Moteurs E-Commerce Évolutifs & Systèmes de Vente",
        testDesc1: "Nous concevons des moteurs e-commerce sur mesure à haute performance, bâtis pour supporter les pics de trafic saisonniers et offrir des parcours d'achat sans friction. Nos systèmes découplent les interfaces front-end et les processus back-end pour plus de sécurité.",
        testDesc2: "Des portails d'achat multi-vendeurs aux intégrations de marchands personnalisées, nous intégrons des modules de paiement sécurisés, des taxes automatisées, des stocks en temps réel et des recommandations prédictives.",
        testBullet1: "Paiement sécurisé sur panier et transactions multi-devises.",
        testBullet2: "Architecture de commerce découplée (headless) avec des API GraphQL.",
        testBullet3: "Rapprochement des stocks en temps réel multi-entrepôts.",
        testBullet4: "Recommandations de produits basées sur l'IA et suivi des paniers.",
        llmTitle: "Déploiement de LLM Privés & Ingénierie d'Agents d'IA",
        llmDesc1: "Au-delà des simples fenêtres de discussion, nous créons des flux de travail basés sur des modèles de langage (LLM) connectés à vos données métiers. Nous concevons des structures RAG (Génération augmentée par récupération) pour interroger vos bases de connaissances sans hallucination.",
        llmDesc2: "Grâce à des bases de données vectorielles (Pinecone, Milvus, PGVector) et des modèles open-source (Llama-3, Mistral, Qwen) hébergés en local ou sur cloud privé, vos données restent confidentielles. Nous concevons également des agents autonomes pour automatiser vos processus.",
        llmBullet1: "Moteurs RAG sur mesure avec bases de données vectorielles haute performance.",
        llmBullet2: "Ajustement fin (fine-tuning) des modèles sur des documents d'entreprise exclusifs.",
        llmBullet3: "Agents d'IA autonomes pour requêtes de bases de données et gestion de tickets.",
        llmBullet4: "Intégrations avec des outils d'orchestration comme LangChain et LlamaIndex.",
        servicesCtaTitle: "Besoin d'une Architecture Technique Sur Mesure ?",
        servicesCtaDesc: "Nos responsables d'ingénierie sont prêts à étudier vos besoins. Contactez-nous pour obtenir un premier schéma d'architecture adapté à vos objectifs.",
        servicesCtaBtn: "Demander un schéma technique",

        // DOMAINS PAGE (domains.html)
        domainsHeadBadge: "Secteurs d'Activité",
        domainsHeadTitle: "Secteurs que nous accompagnons",
        domainsHeadDesc: "Les outils génériques ne résolvent pas les défis spécifiques. Nous développons des applications adaptées aux contraintes de chaque métier et aux réglementations locales.",
        domTitle1: "Commerce Omnicanal & Chaîne d'Approvisionnement Intelligente",
        domDesc1_1: "Les commerçants modernes opèrent sur des réseaux physiques, des applications mobiles et des places de marché tierces. La synchronisation des prix et des stocks est un défi quotidien.",
        domDesc1_2: "Yelagiri Infotech conçoit des réseaux de vente à haut débit qui traitent en temps réel les données de millions d'articles. Nous intégrons des moteurs de tarification dynamique analysant la demande et les délais d'approvisionnement. Nos systèmes synchronisent les stocks pour éviter les ruptures et accélérer la préparation des commandes.",
        domTech1: "Technologies clés : Messagerie événementielle pub/sub, registres de stocks distribués, algorithmes de prédiction de la demande et API de terminaux de vente (POS).",
        domTitle2: "Marchés Publics & Plateformes d'Appels d'Offres",
        domDesc2_1: "Les achats industriels nécessitent une grande transparence, une traçabilité complète et de la rapidité. Les outils d'appels d'offres lents ralentissent le traitement des projets.",
        domDesc2_2: "Nous concevons des plateformes d'appels d'offres multicritères automatisant l'évaluation des fournisseurs. Le système analyse les propositions, vérifie la conformité et calcule les coûts. Grâce à des journaux d'audit sécurisés et des technologies de hachage, nous garantissons l'intégrité des données et favorisons une mise en concurrence équitable.",
        domTech2: "Technologies clés : Chiffrement cryptographique, traitement de documents, algorithmes de sélection multicritères et connexions WebSockets pour les enchères.",
        domTitle3: "Opérations de Services sur le Terrain",
        domDesc3_1: "La gestion des services sur le terrain (maintenance industrielle, réseaux, réparations) exige une planification souple et un traitement fiable des données mobiles.",
        domDesc3_2: "Nos solutions associent un tableau de bord pour les répartiteurs et une application mobile pour les techniciens. Le système suggère des planifications optimales en fonction des compétences et du temps de trajet. Les techniciens disposent de bases de données hors ligne pour consulter les documents et clore les dossiers, les données étant synchronisées dès le retour du réseau.",
        domTech3: "Technologies clés : Intégration d'API GPS, stockage hors ligne sur terminaux mobiles (SQLite/IndexedDB) et moteurs d'allocation automatique.",
        domTitle4: "Évaluation Pédagogique Objective & Analytique",
        domDesc4_1: "Les notations académiques traditionnelles peuvent manquer d'homogénéité et ralentir le suivi des élèves. Mesurer précisément les compétences nécessite des outils structurés.",
        domDesc4_2: "Yelagiri Infotech conçoit des moteurs d'évaluation objective pour les écoles, universités et organismes de certification. Nos outils structurent les examens selon les objectifs pédagogiques (Taxonomie de Bloom). La plateforme gère la distribution sécurisée des épreuves, la détection des fraudes et fournit des tableaux de bord analytiques pour adapter les programmes.",
        domTech4: "Technologies clés : Algorithmes de tests adaptatifs, classifications selon la taxonomie de Bloom, environnements d'examen sécurisés et outils de reporting.",
        domainsCtaTitle: "Une Contrainte Sectorielle Spécifique ?",
        domainsCtaDesc: "Nos ingénieurs développent des systèmes pour des secteurs hautement encadrés. Décrivez-nous vos processus et nous concevrons le logiciel adéquat.",
        domainsCtaBtn: "Consulter un Spécialiste Métier",

        // ABOUT PAGE (about.html)
        aboutHeadBadge: "Notre Identité",
        aboutHeadTitle: "Yelagiri Infotech (OPC)",
        aboutHeadDesc: "Construire des architectures logicielles performantes et personnalisées pour soutenir la croissance de l'entreprise.",
        aboutMissionTitle: "Notre Mission : Transformer les Entreprises par l'IA et l'Excellence Technique",
        aboutMissionDesc1: "Fondée sur le principe que les logiciels doivent être considérés comme des actifs stratégiques et non comme des coûts passagers, Yelagiri Infotech conçoit des solutions logicielles de haute qualité. Nous accompagnons les entreprises dans la modernisation de leurs systèmes et l'intégration sécurisée d'IA.",
        aboutMissionDesc2: "Nous refusons les raccourcis et les modèles de code prêts à l'emploi. Nos ingénieurs analysent chaque besoin pour concevoir des systèmes sur mesure. De la conception aux tests de charge, nous bâtissons des applications stables, sécurisées et prêtes pour l'échelle.",
        aboutIpTitle: "Protection de la Propriété Intellectuelle & Code Unique",
        aboutIpDesc1: "Un logiciel d'entreprise doit être un actif unique. Yelagiri Infotech garantit l'originalité complète des codes sources, des structures de bases de données et des documentations livrées.",
        aboutIpDesc2: "Chaque système que nous concevons est écrit spécifiquement pour vos flux de travail. Nous ne copions pas de structures de code existantes et n'utilisons pas de licences tierces restrictives. Vos plateformes restent votre propriété intellectuelle exclusive.",
        aboutPillarTitle: "Piliers Opérationnels",
        aboutPillarHead1: "Architectures sur Mesure",
        aboutPillarDesc1: "Conceptions uniques développées spécifiquement pour vos indicateurs de performance, sans modèles génériques.",
        aboutPillarHead2: "Transfert Total de Propriété",
        aboutPillarDesc2: "Cession complète de la propriété intellectuelle du code source à votre entreprise dès la livraison.",
        aboutPillarHead3: "Validation QA Continue",
        aboutPillarDesc3: "Des tests automatisés réguliers pour garantir la stabilité et la vélocité de vos applications à grande échelle.",
        aboutDevTitle: "Nos Normes de Qualité de Développement",
        aboutDevDesc: "Nous concevons des plateformes pérennes en nous appuyant sur des technologies éprouvées et des processus de développement stricts.",
        aboutCardTitle1: "Ingénierie de Performance",
        aboutCardDesc1: "Nous développons des API à faible latence et optimisons les requêtes de bases de données pour absorber les variations d'activité.",
        aboutCardTitle2: "Intégrations d'IA Sécurisées",
        aboutCardDesc2: "Nos modèles de langage et pipelines RAG sont déployés au sein de réseaux privés pour protéger vos données.",
        aboutCardTitle3: "Audits de Tests Automatiques",
        aboutCardDesc3: "Nous intégrons les tests d'assurance qualité aux processus de déploiement continu afin de corriger les anomalies au plus tôt.",

        // CONTACT PAGE (contact.html)
        contactHeadBadge: "Collaborer",
        contactHeadTitle: "Échanger avec nos Architectes",
        contactHeadDesc: "Évoquez vos projets de développement, demandez un audit d'architecture ou étudiez des cas d'usage d'IA.",
        contactSideTitle: "Bâtir des Solutions de Premier Plan",
        contactSideDesc: "Nos équipes d'ingénieurs conçoivent des applications d'entreprise sur mesure. Transmettez-nous vos besoins et nous organiserons un entretien technique.",
        contactSideItemTitle1: "Demande Entreprise",
        contactSideItemTitle2: "SLA de Réponse Garantie",
        contactSideItemDesc2: "Toutes les demandes de conseil d'entreprise reçoivent une réponse d'un responsable technique sous 2 heures.",
        contactSideItemTitle3: "Siège social",
        contactSideItemDesc3: "Yelagiri Infotech (OPC). SP-7A Guindy Industrial Estate SIDCO, Chennai - 600032, Tamil Nadu, Inde.",
        contactSideItemTitle4: "Succursale",
        contactSideItemDesc4: "NO 1209/2, Sai Imperia Grand, Mettupalayam Road, Saibaba Colony, Coimbatore, Tamil Nadu 641011",
        labelName: "Votre Nom *",
        labelEmail: "E-mail Professionnel *",
        labelCompany: "Nom de l'Entreprise",
        labelService: "Service concerné *",
        selectServiceDefault: "Sélectionnez le service",
        optErp: "Systèmes ERP Cloud d'Entreprise",
        optField: "Solutions de Services sur le Terrain",
        optStrategy: "Conseil en Stratégie Technique",
        optTesting: "Plateformes E-Commerce",
        optLlm: "Modèles de Langage (LLM) & IA Privée",
        optOther: "Développement Logiciel sur Mesure",
        labelBudget: "Budget / Envergure du Projet",
        optBudget1: "Audit de Diagnostic & Conseil en Architecture",
        optBudget2: "Projet Pilote / MVP (25k$ - 50k$)",
        optBudget3: "Déploiement Système d'Entreprise (50k$ - 150k$)",
        optBudget4: "Développement et Support Pluriannuel (Plus de 150k$)",
        labelMessage: "Objectifs Opérationnels & Description du Projet *",
        placeholderMessage: "Décrivez les difficultés que vous souhaitez résoudre et votre secteur cible (Commerce, Appels d'offres, Services terrain, Éducation)...",
        btnSubmit: "Envoyer la Demande Technique",

        // CAREERS PAGE (careers.html [NEW])
        careersHeadBadge: "Rejoindre l'équipe",
        careersHeadTitle: "Construire l'avenir de la technologie d'entreprise",
        careersHeadDesc: "Chez Yelagiri Infotech, nous cultivons une culture axée sur l'ingénierie, l'excellence technique et le développement de produits évolutifs.",
        careersCultureTitle: "Pourquoi Yelagiri Infotech ?",
        careersCultureDesc: "Nous croyons au recrutement de talents passionnés par la résolution de problèmes d'entreprise complexes. Nous offrons des opportunités uniques de travailler sur des bases de codes écrites de zéro avec des microservices et des architectures d'IA.",
        careersApplyTitle: "Postes Ouverts & Comment Postuler",
        careersApplyDesc: "Nous maintenons un processus de recrutement rationalisé. Tous nos postes ouverts et offres de stages en ingénierie logicielle ou IA sont publiés exclusivement sur LinkedIn et les portails d'emploi majeurs.",
        careersApplyBtn: "Voir les offres sur LinkedIn"
    },
    es: {
        // Navigation
        navHome: "Inicio",
        navServices: "Servicios",
        navDomains: "Sectores",
        navAbout: "Nosotros",
        navContact: "Consultar",
        navCareers: "Carreras",
        
        // Cookie Banner
        cookieText: "Utilizamos cookies para analizar el tráfico, gestionar transacciones seguras y personalizar su experiencia. Al hacer clic en aceptar, acepta nuestro uso de cookies.",
        cookieAccept: "Aceptar",
        cookieDecline: "Rechazar",

        // Footer common
        footerDesc: "Brindando servicios de desarrollo de software personalizado de primer nivel, consultoría de TI e ingeniería de IA segura. Ayudando a las organizaciones a escalar con seguridad y excelencia técnica.",
        footerServicesTitle: "Servicios de Ingeniería",
        footerDomainsTitle: "Sectores Clave",
        footerNewsletterTitle: "Manténgase Informado",
        footerNewsletterP: "Suscríbase a nuestro boletín para recibir análisis sobre estrategia de TI y tendencias de ingeniería de IA.",
        footerNewsletterBtn: "Unirse",
        footerNewsletterPlaceholder: "Ingrese correo comercial",
        footerCopyright: "© 2026 Yelagiri Infotech (OPC). Todos los derechos reservados. Desarrollado con excelencia técnica.",
        addressRegisteredLabel: "Oficina registrada:",
        addressBranchLabel: "Sucursal:",

        // HOME PAGE (index.html)
        heroBadge: "Más allá de las transacciones: construyendo compromiso",
        heroTitle: "Ingeniería de Inteligencia. Desarrollando Productos Duraderos.",
        heroDesc: "En Yelagiri Infotech construimos soluciones en la nube personalizadas para optimizar operaciones complejas. Entregamos sistemas de comercio electrónico de última generación, software de servicios de campo automatizado, productos SAAS robustos, aplicaciones móviles especializadas e integraciones de modelos de lenguaje para preparar a su empresa para la era cognitiva.",
        heroCtaPrimary: "Comenzar Proyecto",
        heroCtaSecondary: "Ver servicios",
        statUptimeLabel: "Disponibilidad SLA del sistema",
        statClientsLabel: "Empresas impulsadas",
        statLlmLabel: "Motores de IA cognitiva",
        statAssessLabel: "Evaluaciones objetivas",
        philBadge: "Excelencia en ingeniería",
        philTitle: "Combinando ingeniería avanzada con visión estratégica",
        philText1: "Las empresas modernas se enfrentan al doble reto de mantener operaciones diarias robustas y escalables y, al mismo tiempo, adoptar la inteligencia artificial para asegurar su liderazgo en el mercado. Yelagiri Infotech cubre esta brecha.",
        philText2: "We don't believe in generic, out-of-the-box software wrappers. We design, architect, and deploy clean, bespoke microservice architectures that seamlessly connect into your existing systems. By prioritizing raw performance, strict data compliance, and flexible cloud designs, we help you transform operational expenses into long-term assets.",
        philBtn: "Conozca nuestra filosofía",
        philFeatTitle1: "Infraestructura Cloud Escalable",
        philFeatDesc1: "Todas las soluciones se construyen con tecnologías nativas de la nube, soportando millones de transacciones de forma fluida.",
        philFeatTitle2: "Inteligencia Artificielle Segura",
        philFeatDesc2: "Integramos LLM y arquitecturas neuronales manteniendo la protección de la propiedad intelectual y el alojamiento privado como prioridades absolutas.",
        philFeatTitle3: "Garantía de Calidad Validada",
        philFeatDesc3: "Cada desarrollo pasa por pruebas de software rigurosas y continuas para garantizar un funcionamiento perfecto y tiempos de respuesta veloces.",
        servBadge: "Capacidades",
        servTitle: "Servicios de software a medida",
        servDesc: "Descubra nuestras capacidades de ingeniería de software diseñadas para impulsar cada departamento de su empresa.",
        servCardTitle1: "Sistemas ERP en la Nube",
        servCardDesc1: "Bespoke Enterprise Resource Planning software developed to centralize supply chains, financial auditing, inventory pools, and personnel workflows. Built for massive transactional throughput.",
        servCardLink1: "Saber más",
        servCardTitle2: "Software de servicios de campo",
        servCardDesc2: "End-to-end mobile dispatch platforms featuring dynamic GPS routing, offline functionality, real-time job allocation, and telemetry integrations for distributed field assets.",
        servCardLink2: "Saber más",
        servCardTitle3: "IA y LLM personalizados",
        servCardDesc3: "Production-grade Large Language Model implementations, Retrieval-Augmented Generation (RAG) databases, and agentic workflows tuned to proprietary business documents.",
        servCardLink3: "Saber más",
        servCardTitle4: "Plataformas de E-Commerce",
        servCardDesc4: "Motores de comercio electrónico personalizados de alto rendimiento, preparados para soportar picos transaccionales y facilitar compras seguras.",
        servCardLink4: "Saber más",
        ctaTitle: "¿Listo para diseñar su ventaja competitiva?",
        ctaDesc: "Hable con los arquitectos de Yelagiri Infotech hoy mismo. Permítanos diseñar una estrategia técnica estructurada o desarrollar un prototipo que demuestre el retorno de inversión.",
        ctaBtn: "Programar revisión estratégica",

        // SERVICES PAGE (services.html)
        servicesHeadBadge: "Matriz de Capacidades",
        servicesHeadTitle: "Nuestras Especialidades de Ingeniería",
        servicesHeadDesc: "Proporcionamos ingeniería de software de ciclo de vida completo e implementación de IA. Explore nuestras áreas clave de servicio a continuación.",
        tabErpBtn: "ERP Corporativo",
        tabFieldBtn: "Servicios de Campo",
        tabStrategyBtn: "Estrategia Tech",
        tabTestingBtn: "Plataformas de E-Commerce",
        tabLlmBtn: "LLM e IA Generativa",
        erpTitle: "Planificación de Recursos Empresariales (ERP) de Última Generación",
        erpDesc1: "Las operaciones modernas requieren transparencia en tiempo real. Nuestras soluciones ERP personalizadas unifican flujos de trabajo complejos en una plataforma digital integrada. Diseñamos entornos web flexibles y basados en eventos adaptados a sus procesos comerciales en lugar de sistemas tradicional rígidos.",
        erpDesc2: "Nos especializamos en sincronización de inventario, automatización de compras a proveedores, registros contables en tiempo real y facturación multidivisa. Nuestras arquitecturas aprovechan API robustas, optimización de bases de datos (PostgreSQL/Redis) y contenedores seguros para absorber picos transaccionales.",
        erpBullet1: "Conciliación automática de inventarios y contabilidad en tiempo real.",
        erpBullet2: "Flujos de órdenes de compra con proveedores y planificación logística predictiva.",
        erpBullet3: "Control de acceso basado en roles (RBAC) y registros de auditoría para cumplimiento de seguridad.",
        erpBullet4: "Integración con sistemas tradicionales de contabilidad, logística y bases de datos CRM.",
        fieldTitle: "Plataformas Inteligentes de Servicios de Campo",
        fieldDesc1: "Gestionar cuadrillas de servicio requiere coordinación inmediata y sincronización de datos eficiente. Yelagiri Infotech desarrolla herramientas móviles que alinean en tiempo real a despachadores y técnicos.",
        fieldDesc2: "Nuestras soluciones cuentan con un motor de rutas personalizado que analiza el tráfico, las habilidades técnicas y la ubicación del servicio. Las aplicaciones móviles están diseñadas para operar sin conexión a internet, permitiendo consultar manuales y capturar firmas de conformidad, cargando los datos al reconectarse.",
        fieldBullet1: "Optimización de rutas de transporte y localización GPS de técnicos.",
        fieldBullet2: "Aplicaciones móviles con bases de datos SQLite de uso offline.",
        fieldBullet3: "Consola de despacho interactiva con asignación de tareas en calendarios dinámicos.",
        fieldBullet4: "Notificaciones automáticas a clientes mediante mensajes de texto (SMS) y correo electrónico.",
        stratTitle: "Estrategia Tecnológica y Consultoría de Arquitectura",
        stratDesc1: "Una mala planificación del sistema puede limitar el crecimiento empresarial. Nuestros consultores realizan revisiones técnicas profundas para identificar cuellos de botella, riesgos de seguridad y puntos de falla críticos.",
        stratDesc2: "Ayudamos a los directivos a planificar migraciones a la nube seguras, a reestructurar arquitecturas tradicionales en microservicios e integrar soluciones de inteligencia artificial. Trazamos planes de desarrollo prácticos y rentables.",
        stratBullet1: "Planes de migración de sistemas monolíticos a microservicios y serverless.",
        stratBullet2: "Optimización de costos en nubes múltiples (AWS, GCP, Azure).",
        stratBullet3: "Planes de recuperación ante desastres y políticas de respaldo de bases de datos.",
        stratBullet4: "Ateliers de preparación de IA y evaluación de proveedores de tecnología.",
        testTitle: "Motores de Comercio Electrónico Escalables",
        testDesc1: "Desarrollamos motores de comercio electrónico personalizados de alto rendimiento, preparados para soportar picos transaccionales de temporada y facilitar compras sin fricciones. Desacoplamos interfaces front-end de back-end para mayor seguridad.",
        testDesc2: "Desde portales multi-tienda hasta pasarelas de pago a medida, integramos procesamiento seguro de compras, algoritmos de cálculo de impuestos automáticos, inventario en tiempo real y recomendaciones predictivas.",
        testBullet1: "Procesamiento seguro de carrito de compras y pasarelas multidivisa.",
        testBullet2: "Arquitectura de comercio desacoplado (headless) con APIs GraphQL.",
        testBullet3: "Sincronización de inventario multi-almacén en tiempo real.",
        testBullet4: "Recomendaciones de productos con IA y seguimiento de carritos.",
        llmTitle: "Despliegue de LLM Privados e Ingeniería de Agentes de IA",
        llmDesc1: "Creamos herramientas de procesamiento de lenguaje natural conectadas a la información interna de su organización, superando los chats tradicionales genéricos. Estructuramos motores RAG para búsquedas de información sin errores ni alucinaciones.",
        llmDesc2: "Mediante el uso de bases de datos vectoriales (Pinecone, Milvus, PGVector) y modelos open-source (Llama-3, Mistral, Qwen) alojados localmente o en su nube privada, la información comercial nunca sale de su control. Diseñamos agentes de IA autónomos.",
        llmBullet1: "Motores de búsqueda RAG a medida mediante bases de datos vectoriales veloces.",
        llmBullet2: "Entrenamiento (fine-tuning) de modelos con datos e informes internos de su empresa.",
        llmBullet3: "Agentes autónomos de IA para consultas de base de datos y gestión de solicitudes.",
        llmBullet4: "Implementaciones con herramientas de orquestación como LangChain y LlamaIndex.",
        servicesCtaTitle: "¿Necesita una Arquitectura Técnica a la Medida?",
        servicesCtaDesc: "Nuestros ingenieros principales están listos para analizar su proyecto. Contáctenos para recibir un esquema técnico preliminar.",
        servicesCtaBtn: "Solicitar propuesta técnica",

        // DOMAINS PAGE (domains.html)
        domainsHeadBadge: "Sectores de Especialidad",
        domainsHeadTitle: "Sectores que impulsamos",
        domainsHeadDesc: "Las herramientas genéricas no resuelven problemas comerciales específicos. Desarrollamos soluciones adaptadas a los procesos de su sector y normativas vigentes.",
        domTitle1: "Comercio Omnicanal y Cadena de Suministro Inteligente",
        domDesc1_1: "Los minoristas modernos operan en tiendas físicas, aplicaciones y mercados digitales. Mantener actualizados precios e inventarios en todos los canales es un desafío operativo común.",
        domDesc1_2: "Yelagiri Infotech desarrolla arquitecturas de venta que procesan transacciones de millones de productos en tiempo real. Implementamos motores de precios dinámicos según la demanda y los tiempos de envío. Sincronizamos stocks para agilizar los despachos y evitar ventas sin disponibilidad.",
        domTech1: "Tecnologías clave: Mensajería por eventos pub/sub, inventarios distribuidos, algoritmos predictivos de demanda e integración de API para terminales de venta (POS).",
        domTitle2: "Licitaciones Transparentes y Compras Públicas",
        domDesc2_1: "Las compras industriales y licitaciones requieren alta transparencia, registros claros y velocidad. Las herramientas de licitación lentas pueden retrasar los proyectos.",
        domDesc2_2: "Desarrollamos portales de licitaciones multicriterio que automatizan la selección de contratistas. El sistema procesa propuestas, analiza cotizaciones y verifica requisitos técnicos. Con tecnologías de hachado y bitácoras seguras, aseguramos la integridad del concurso frente a manipulaciones.",
        domTech2: "Tecnologías clave: Cifrado criptográfico de propuestas, procesamiento inteligente de documentos, algoritmos de selección y canales WebSockets para ofertas en tiempo real.",
        domTitle3: "Servicios de Campo y Operaciones de Distribución",
        domDesc3_1: "Administrar servicios externos (instalaciones, mantenimiento industrial, redes) requiere una asignación de tareas flexible y captura de datos móviles estable.",
        domDesc3_2: "Nuestras plataformas conectan a los despachadores en la oficina con los técnicos en el terreno. El sistema optimiza asignaciones en base a rutas y destrezas. Los operarios cuentan con bases de datos sin conexión a internet para consultar manuales y rellenar informes, sincronizándose al recuperar señal.",
        domTech3: "Tecnologías clave: Integración de API GPS, bases de datos integradas de uso offline (SQLite/IndexedDB) y motores automáticos de asignación.",
        domTitle4: "Evaluación Educativa Objetiva y Analítica",
        domDesc4_1: "Las calificaciones académicas tradicionales pueden carecer de uniformidad y demorar el seguimiento. Medir el aprendizaje requiere herramientas estructuradas.",
        domDesc4_2: "Yelagiri Infotech diseña motores de evaluación objetiva para centros educativos, universidades y organismos de certificación. Estructuramos exámenes basados en los objetivos de la materia (Taxonomía de Bloom), gestionando el examen de forma segura, previniendo fraudes y ofreciendo reportes analíticos de aprendizaje.",
        domTech4: "Tecnologías clave: Algoritmos de evaluación adaptativa, clasificaciones de taxonomía de Bloom, entornos de examen bloqueados y analíticas educativas.",
        domainsCtaTitle: "¿Tiene un Requisito de Sector Específico?",
        domainsCtaDesc: "Diseñamos sistemas para entornos comerciales regulados. Descríbanos sus flujos de trabajo y estructuraremos una propuesta de software adecuada.",
        domainsCtaBtn: "Consultar con un Especialista del Sector",

        // ABOUT PAGE (about.html)
        aboutHeadBadge: "Nuestra Identidad",
        aboutHeadTitle: "Yelagiri Infotech (OPC)",
        aboutHeadDesc: "Construyendo arquitecturas de software robustas y personalizadas para respaldar el crecimiento empresarial.",
        aboutMissionTitle: "Nuestra Misión: Transformar las Empresas mediante la IA y la Excelencia Técnica",
        aboutMissionDesc1: "Fundada con la convicción de que el software debe ser tratado como un activo principal de la empresa y no como un gasto temporal, Yelagiri Infotech desarrolla soluciones de software de alta calidad. Ayudamos a las empresas a modernizar sus sistemas e integrar inteligencia artificial en entornos seguros.",
        aboutMissionDesc2: "Evitamos las plantillas y el código genérico preconstruido. Nuestros ingenieros abordan cada desafío para diseñar sistemas de forma específica. Desde la arquitectura inicial hasta las pruebas de estrés, creamos herramientas estables, seguras y escalables.",
        aboutIpTitle: "Propiedad Intelectual Protegida y Código Original",
        aboutIpDesc1: "El software de su empresa debe ser un activo exclusivo. Yelagiri Infotech garantiza la originalidad total del código fuente, las bases de datos y la documentación entregada.",
        aboutIpDesc2: "Cada sistema está escrito específicamente para sus procesos. No reutilizamos estructuras de código externas ni aplicamos licencias restrictivas. El software desarrollado es propiedad intelectual exclusiva de su empresa.",
        aboutPillarTitle: "Pilares Operativos",
        aboutPillarHead1: "Diseño Personalizado",
        aboutPillarDesc1: "Sistemas únicos desarrollados específicamente para sus indicadores de rendimiento, sin plantillas genéricas.",
        aboutPillarHead2: "Caja de Propiedad Total",
        aboutPillarDesc2: "Transferencia total de la propiedad del código fuente a su empresa tras la entrega.",
        aboutPillarHead3: "Aseguramiento QA Continuo",
        aboutPillarDesc3: "Pruebas de software automáticas y continuas para garantizar que su sistema funcione de forma rápida y estable.",
        aboutDevTitle: "Nuestros Estándares de Calidad de Desarrollo",
        aboutDevDesc: "Creamos herramientas duraderas apoyándonos en tecnologías estables y procesos estrictos de desarrollo.",
        aboutCardTitle1: "Ingeniería de Rendimiento",
        aboutCardDesc1: "Diseñamos API rápidas y consultas de base de datos optimizadas para absorber variaciones en el volumen de transacciones.",
        aboutCardTitle2: "Despliegues de IA Seguros",
        aboutCardDesc2: "Instalamos modelos de lenguaje y flujos RAG dentro de redes privadas para mantener la confidencialidad de la información comercial.",
        aboutCardTitle3: "Pruebas QA Continuas",
        aboutCardDesc3: "Integramos pruebas automáticas en las etapas de despliegue continuo para resolver cualquier error de forma oportuna.",

        // CONTACT PAGE (contact.html)
        contactHeadBadge: "Colaborar",
        contactHeadTitle: "Conversar con nuestros Arquitectos",
        contactHeadDesc: "Hable sobre su proyecto de desarrollo, solicite un análisis técnico de sus sistemas o evalúe alternativas de IA.",
        contactSideTitle: "Crear Soluciones de Primer Nivel",
        contactSideDesc: "Nuestros ingenieros principales diseñan software empresarial personalizado. Envíenos su propuesta y organizaremos una reunión de análisis.",
        contactSideItemTitle1: "Contacto Corporativo",
        contactSideItemTitle2: "Respuesta SLA Garantizada",
        contactSideItemDesc2: "Todas las solicitudes de consultoría corporativa reciben respuesta por parte de un ingeniero principal en menos de 2 horas.",
        contactSideItemTitle3: "Oficina registrada",
        contactSideItemDesc3: "Yelagiri Infotech (OPC). SP-7A Guindy Industrial Estate SIDCO, Chennai - 600032, Tamil Nadu, India.",
        contactSideItemTitle4: "Sucursal",
        contactSideItemDesc4: "NO 1209/2, Sai Imperia Grand, Mettupalayam Road, Saibaba Colony, Coimbatore, Tamil Nadu 641011",
        labelName: "Su Nombre *",
        labelEmail: "Correo Electrónico Comercial *",
        labelCompany: "Nombre de la Empresa",
        labelService: "Servicio de Interés *",
        selectServiceDefault: "Seleccione el servicio",
        optErp: "Sistemas ERP Corporativos Cloud",
        optField: "Soluciones para Servicios de Campo",
        optStrategy: "Estrategia de TI y Consultoría",
        optTesting: "Plataformas de E-Commerce",
        optLlm: "Modelos de Lenguaje (LLM) e IA Privada",
        optOther: "Desarrollo de Software a Medida",
        labelBudget: "Presupuesto / Alcance del Proyecto",
        optBudget1: "Análisis Diagnóstico y Consultoría de Arquitectura",
        optBudget2: "Proyecto Piloto / Producto Mínimo Viable ($25k - $50k)",
        optBudget3: "Despliegue de Sistema Corporativo ($50k - $150k)",
        optBudget4: "Desarrollo y Soporte Plurianual (Más de $150k)",
        labelMessage: "Objetivos de Negocio y Alcance del Proyecto *",
        placeholderMessage: "Describa los problemas operativos que busca solucionar y el sector correspondiente (Ventas, Licitaciones, Servicios, Educación)...",
        btnSubmit: "Enviar Solicitud Técnica",

        // CAREERS PAGE (careers.html [NEW])
        careersHeadBadge: "Únete a nuestro equipo",
        careersHeadTitle: "Diseña el Futuro de la Tecnología Empresarial",
        careersHeadDesc: "En Yelagiri Infotech cultivamos una cultura de ingeniería enfocada en la excelencia técnica, desarrollos seguros de IA y productos escalables.",
        careersCultureTitle: "¿Por qué Yelagiri Infotech?",
        careersCultureDesc: "Creemos en contratar personas talentosas apasionadas por resolver problemas empresariales complejos. Ofrecemos oportunidades únicas de trabajar en desarrollos de código limpios desde cero utilizando microservicios y bases de datos vectoriales.",
        careersApplyTitle: "Vacantes Abiertas y Cómo Postularse",
        careersApplyDesc: "Mantenemos un proceso de reclutamiento simplificado. Todas nuestras vacantes activas y ofertas de prácticas de ingeniería de software o IA se publican exclusivamente a través de LinkedIn y los principales portales de empleo.",
        careersApplyBtn: "Ver vacantes en LinkedIn"
    }
};

/* --- Globalization Switcher Logic --- */
function initGlobalization() {
    const langSelects = document.querySelectorAll('.lang-select');
    if (langSelects.length === 0) return;

    let currentLang = localStorage.getItem('selectedLanguage');
    if (!currentLang) {
        const browserLang = navigator.language.slice(0, 2);
        currentLang = ['en', 'fr', 'es'].includes(browserLang) ? browserLang : 'en';
        localStorage.setItem('selectedLanguage', currentLang);
    }

    langSelects.forEach(select => {
        select.value = currentLang;
        
        select.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            localStorage.setItem('selectedLanguage', selectedLang);
            langSelects.forEach(s => s.value = selectedLang);
            updateLanguage(selectedLang);
        });
    });

    updateLanguage(currentLang);
}

function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            const textValue = translations[lang][key];

            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.type === 'submit' || el.type === 'button') {
                    el.value = textValue;
                } else {
                    el.setAttribute('placeholder', textValue);
                }
            } else if (el.tagName === 'SELECT') {
                const defaultOpt = el.querySelector('option[disabled]');
                if (defaultOpt) {
                    defaultOpt.text = textValue;
                }
            } else {
                el.innerHTML = textValue;
            }
        }
    });

    document.documentElement.setAttribute('lang', lang);
}
