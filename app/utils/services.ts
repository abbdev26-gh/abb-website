import {
  PhBriefcase,
  PhMapPin,
  PhChalkboardTeacher,
  PhStrategy,
  PhHandshake,
  PhGlobeHemisphereWest,
  PhRocketLaunch
} from '@phosphor-icons/vue';

export const servicesData = [
  {
    id: 1,
    title: 'Workspace Solutions',
    slug: 'workspace-solutions',
    description: 'Executive work spaces at cost-effective prices.',
    longDescription: 'Experience premium executive workspaces designed for productivity. We offer cost-effective solutions without compromising on quality or comfort, perfect for teams of all sizes.',
    stat: 'Cost Effective',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    icon: PhBriefcase,
    content: `
      <h3>ABB Co-working Space</h3>
      <p>We provide <strong>premium, flexible workspace</strong> at cost-effective prices by offering unrestricted access to our Tema and Airport City hubs. This guarantees a reliable infrastructure, including power and high-speed internet, in a professional environment, while integrating access to specialized networking communities.</p>
    `,
    workspaceSolutions: [
      {
        category: 'Premium Offices',
        description: 'Fully furnished, private, and secure dedicated office suites.',
        useCase: 'Established companies or executives requiring the highest level of privacy and dedicated infrastructure.'
      },
      {
        category: 'Co-working Space',
        description: 'Flexible, open-plan shared workspaces available on a membership or day rate basis.',
        useCase: 'Freelancers, small teams, or budget-conscious professionals needing a daily professional setting.'
      },
      {
        category: 'Working Groups',
        description: 'Bookable spaces tailored for larger structured business activities.',
        useCase: 'Conferences, Training Rooms, and larger Team Meeting Spaces.'
      }
    ]
  },
  {
    id: 2,
    title: 'Virtual Office',
    slug: 'virtual-office',
    description: 'Primary or auxiliary business address locations.',
    longDescription: 'Establish a professional presence with our virtual address services. Use our prime location as your primary or auxiliary business address to build trust with your clients.',
    stat: 'Prime Location',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200',
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
        feature: 'Airport City Hub',
        benefit: 'Formal registration and official correspondence.'
      },
      {
        feature: 'Official Registration Address',
        benefit: 'Eliminates the credibility gap for new businesses and offshore entities.'
      },
      {
        feature: 'Full Mail Handling',
        benefit: 'Secure reception and management of all physical mail and correspondence.'
      },
      {
        feature: 'Notification & Forwarding',
        benefit: 'Prompt client notification of new mail, with secure forwarding services.'
      }
    ]
  },
  {
    id: 3,
    title: 'Masterclasses',
    slug: 'masterclasses',
    description: 'Refreshing insights from industry experts.',
    longDescription: 'Join us every last Saturday of the month for refreshing insights and knowledge sharing from renowned experts and captains of industries to stay ahead of the curve.',
    stat: 'Monthly Events',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
    icon: PhChalkboardTeacher,
    content: `
      <h3>Masterclass & Accelerated Training Programs</h3>
      <p>We provide refreshing insights from experts and captains of industries through innovative, effective, and <strong>customized training experiences</strong>. Our offerings are strategically segmented for different audiences.</p>
    `,
    masterclasses: [
      {
        audience: 'Students (Startups/Entrepreneur)',
        focus: 'Core business fundamentals (Financial Management, Pitching Skills).'
      },
      {
        audience: 'Corporate (Working Professionals)',
        focus: 'Advanced and specialized topics (M&A, Advanced Tax Strategy, Strategy & Growth Planning).'
      }
    ],
    features: [
      {
        title: 'Standardized & General Curriculum',
        description: 'Focus on core topics like Financial Management and Pitching Skills.'
      },
      {
        title: 'Customized Curriculum',
        description: 'Tailored internal training for teams within an organization.'
      },
      {
        title: 'Executive & Advanced Clinics',
        description: 'Delivered by C-suite executives on complex topics.'
      }
    ]
  },
  {
    id: 4,
    title: 'Business Advisory',
    slug: 'business-advisory',
    description: 'Digital marketing, public speaking, legal, and more.',
    longDescription: 'Comprehensive advisory services covering digital marketing, public speaking, legal compliance, and other critical business areas to help you navigate challenges.',
    stat: 'Expert Advice',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200',
    icon: PhStrategy,
    content: `
      <h3>Business Advisory Services</h3>
      <p>We provide relevant advisory services that formalize the strategic support offered, acting as a direct consultancy arm. These services cover critical areas:</p>
    `,
    features: [
      {
        title: 'Strategy & Growth Planning',
        description: '(market entry, expansion, operational restructuring).'
      },
      {
        title: 'Financial Structuring',
        description: '(optimal legal and financial setup, capital allocation).'
      },
      {
        title: 'Funding Facilitation',
        description: '(preparing pitch decks, structuring deals, and connecting to grants, loans, and angel investors).'
      }
    ]
  },
  {
    id: 5,
    title: 'Mentorship & Coaching',
    slug: 'mentorship-coaching',
    description: 'Expert pairing and guidance for business success.',
    longDescription: 'We provide expert pairing and personalized guidance services to ensure your professional growth and business success through tailored mentorship programs.',
    stat: '1-on-1 Guidance',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200',
    icon: PhHandshake,
    content: `
      <h3>Mentorship & Coaching</h3>
      <p>We provide expert pairing and guidance services utilizing modern technology and proven executive experience for targeted guidance and accelerated strategic development. This includes:</p>
    `,
    features: [
      {
        title: 'Executive Coaching',
        description: 'For personalized, one-on-one guidance on advanced strategy and leadership development.'
      },
      {
        title: 'Executive Shadowing & Board Immersion',
        description: 'For top founders to learn high-level governance and organizational structure firsthand.'
      },
      {
        title: 'Peer-to-Peer Learning',
        description: 'Through structured group coaching and collaborative problem-solving.'
      }
    ]
  },
  {
    id: 6,
    title: 'CSR Outsourcing',
    slug: 'csr-outsourcing',
    description: '360-degree solutions for your CSR initiatives.',
    longDescription: 'Let us handle your Corporate Social Responsibility initiatives. We provide complete, 360-degree solutions to manage and execute your CSR impact effectively.',
    stat: '360° Solutions',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
    icon: PhGlobeHemisphereWest,
    content: `
      <h3>CSR Outsourcing (Corporate Social Responsibility)</h3>
      <p>We deliver a <strong>360-degree solution</strong> for all your CSR initiatives by allowing corporations to <strong>fully outsource</strong> their project execution to ABB. ABB takes on the responsibility to design, execute, and manage the projects, delivering successful and measurable results. This ensures our corporate partners <strong>celebrate the impact</strong> without being burdened by the operational hustle of execution.</p>
    `,
    features: [
      {
        title: 'Impact Program Design & Execution',
        description: "We design, implement, and manage customized CSR programs focused on entrepreneurship, skill development, and community resilience that seamlessly align with your company's ESG goals (Environmental, Social, and Governance)."
      },
      {
        title: 'Youth & Women Empowerment Focus',
        description: "We facilitate the direct channeling of CSR funds into ABB's pre-vetted portfolio of youth and women-led businesses, providing immediate, measurable impact in alignment with your public image."
      },
      {
        title: 'Impact Reporting & Accountability',
        description: 'We provide audited, detailed reports and media documentation to ensure full accountability. This allows your company to report on quantifiable social outcomes (e.g., jobs created, businesses scaled, SDGs supported) without managing the operational complexity'
      }
    ]
  },
  {
    id: 7,
    title: 'Accelerator-Incubator',
    slug: 'accelerator-incubator',
    description: 'A blended model positioning you for growth.',
    longDescription: 'Our unique blended accelerator-incubator model is the heart of who we are, positioning startups for rapid growth and sustainable success in a competitive market.',
    stat: 'Growth Focused',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
    icon: PhRocketLaunch,
    content: `
      <h3>A Blended Accelerator-Incubator Model</h3>
      <p>ABB positions itself as a <strong>governance training ground</strong> and a <strong>hub for serious, growth-oriented founders</strong>. Our model is a hybrid that supports both early-stage businesses (The Founder) with services like the Virtual Address and core Masterclass training, as well as scaling companies (The Scaling CEO) requiring advanced strategy, Executive Coaching, and Business Advisory. We provide end-to-end support, moving beyond traditional training to deliver customized, specialized guidance from idea to advanced scale.</p>
    `
  }
];
