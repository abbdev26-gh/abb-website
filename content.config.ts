import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        hero: defineCollection({
            type: 'data',
            source: 'hero.json',
            schema: z.object({
                title: z.string(),
                description: z.string(),
                videoURL: z.string(),
                heroUrl: z.string(),
                heroCTA: z.string()
            }).passthrough()
        }),
        about: defineCollection({
            type: 'data',
            source: 'about.json',
            schema: z.object({
                title: z.string(),
                description: z.string(),
                stats: z.array(z.object({
                    id: z.number(),
                    icon: z.string(),
                    label: z.string(),
                    value: z.string(),
                    description: z.string()
                })),
                values: z.array(z.object({
                    id: z.number().optional(),
                    title: z.string(),
                    description: z.string(),
                    icon: z.string().optional()
                })).optional(),
                valuesSectionTitle: z.string().optional(),
                valuesSectionDescription: z.string().nullable().optional(),
                scrollSectionTopText: z.string().optional(),
                scrollSectionBottomText: z.string().optional(),
                storyTitle: z.string().optional(),
                storyDescription: z.string().optional(),
                scrollSectionAttribution: z.string().optional()
            }).passthrough()
        }),
        home_about: defineCollection({
            type: 'data',
            source: 'home_about.json',
            schema: z.object({
                preHeader: z.string(),
                preDescription: z.string(),
                title: z.string(),
                body: z.string(),
                stats: z.array(z.object({
                    id: z.number(),
                    icon: z.string().optional(),
                    label: z.string(),
                    value: z.string()
                })),
                sectionImage: z.object({
                    url: z.string(),
                    alternativeText: z.string().nullable().optional()
                }).passthrough(),
                sectionCTA: z.object({
                    ctaText: z.string(),
                    url: z.string()
                }).passthrough(),
                storyTimeline: z.array(z.object({
                    id: z.number(),
                    year: z.string(),
                    title: z.string(),
                    description: z.string()
                }))
            }).passthrough()
        }),
        services: defineCollection({
            type: 'page',
            source: 'services/*.json',
            schema: z.object({
                slug: z.string(),
                publishedAt: z.string(),
                name: z.string(),
                shortDescription: z.string().optional(),
                description: z.string().optional(),
                longDescription: z.string().optional(),
                stat: z.string().optional(),
                externalLink: z.string().optional(),
                linkText: z.string().optional(),
                serviceImage: z.array(z.object({
                    url: z.string(),
                    alternativeText: z.string().nullable().optional()
                }).passthrough()).optional(),
                featuresList: z.array(z.object({
                    title: z.string().optional(),
                    description: z.string().optional()
                }).passthrough()).optional(),
                workspaceSolutions: z.array(z.object({
                    id: z.number(),
                    category: z.string(),
                    description: z.string(),
                    useCase: z.string()
                }).passthrough()).optional(),
                programComparisons: z.array(z.object({
                    id: z.number(),
                    programName: z.string(),
                    targetAudience: z.string(),
                    serviceFocus: z.string(),
                    keySupportProvided: z.string()
                }).passthrough()).optional(),
                virtualPresence: z.array(z.object({
                    id: z.number(),
                    title: z.string(),
                    description: z.string(),
                    features: z.array(z.object({
                        id: z.number(),
                        title: z.string(),
                        description: z.string()
                    }).passthrough()).optional(),
                    benefits: z.array(z.object({
                        id: z.number(),
                        title: z.string(),
                        description: z.string()
                    }).passthrough()).optional()
                }).passthrough()).optional(),
                virtualOffices: z.array(z.object({
                    id: z.number(),
                    title: z.string(),
                    price: z.string()
                }).passthrough()).optional(),
                masterclasses: z.array(z.object({
                    id: z.number(),
                    title: z.string(),
                    date: z.string().optional()
                }).passthrough()).optional()
            }).passthrough()
        }),
        testimonials: defineCollection({
            type: 'data',
            source: 'testimonials/*.json',
            schema: z.object({
                name: z.string(),
                role: z.string(),
                quote: z.string(),
                image: z.object({
                    url: z.string()
                }).passthrough().nullable().optional()
            })
        }),
        partners: defineCollection({
            type: 'data',
            source: 'partners/*.json',
            schema: z.object({
                name: z.string(),
                logo: z.object({
                    url: z.string(),
                    alternativeText: z.string().nullable().optional()
                }).passthrough()
            }).passthrough()
        }),
        gallery: defineCollection({
            type: 'data',
            source: 'gallery/*.json',
            schema: z.object({
                order: z.number(),
                title: z.string(),
                description: z.string(),
                images: z.array(z.object({
                    url: z.string(),
                    alternativeText: z.string().nullable().optional()
                }).passthrough())
            }).passthrough()
        }),
        locations: defineCollection({
            type: 'data',
            source: 'locations/*.json',
            schema: z.object({
                name: z.string(),
                city: z.string(),
                address: z.string(),
                fullAddress: z.string().optional(),
                email: z.string(),
                phone: z.string().optional(),
                hours: z.string(),
                slug: z.string(),
                mapUrl: z.string().nullable().optional()
            }).passthrough()
        }),
        membership: defineCollection({
            type: 'data',
            source: 'membership.json',
            schema: z.object({
                title: z.string(),
                description: z.string().nullable().optional(),
                listItems: z.array(z.object({
                    title: z.string().optional(),
                    description: z.string().optional(),
                    icon: z.string().optional()
                }).passthrough()),
                cta: z.object({
                    ctaText: z.string(),
                    url: z.string()
                }),
                sectionImage: z.array(z.object({
                    url: z.string(),
                    alternativeText: z.string().nullable().optional()
                }).passthrough())
            }).passthrough()
        }),
        contact: defineCollection({
            type: 'data',
            source: 'contact.json',
            schema: z.object({
                title: z.string(),
                description: z.string(),
                contactOptions: z.array(z.object({
                    id: z.number(),
                    type: z.string(),
                    value: z.string(),
                    label: z.string()
                }).passthrough())
            }).passthrough()
        }),
        cta: defineCollection({
            type: 'data',
            source: 'cta.json',
            schema: z.object({
                heading: z.string(),
                description: z.string(),
                cta: z.object({
                    ctaText: z.string(),
                    url: z.string()
                })
            }).passthrough()
        }),
        team: defineCollection({
            type: 'data',
            source: 'team/*.json',
            schema: z.object({
                name: z.string(),
                role: z.string(),
                image: z.object({
                    url: z.string()
                }).passthrough(),
                order: z.number().int().optional(),
                linkedin: z.string().nullable().optional(),
                twitter: z.string().nullable().optional(),
                email: z.string().nullable().optional()
            }).passthrough()
        })
    }
})
