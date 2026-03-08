export const siteData = {
  title: 'Two Drifters',
  subtitle: 'A Virtual Museum of Adventure',
  tagline: 'Two dreamers, one world, a lifetime of wonder',

  couple: {
    names: ['Pat', 'Jack'],
    zodiac: 'Gemini',
    description:
      'Born under the sign of the Twins, Pat and Jack have spent a lifetime collecting moments across every continent. From the rice paddies of Vietnam to the onion domes of Russia, their story is one of curiosity, service, and an unshakeable love of discovery.',
  },

  journeys: [
    {
      id: 'peace-corps',
      title: 'The Peace Corps Years',
      location: 'Various',
      period: 'Service Abroad',
      description:
        'Pat and Jack answered the call of service, joining the Peace Corps to bring their skills and compassion to communities around the world. These years forged the foundation of a lifelong commitment to understanding cultures from the inside out.',
      icon: '\u{1F30D}',
    },
    {
      id: 'vietnam',
      title: 'Vietnam: Service and Honor',
      location: 'Vietnam',
      period: 'USMC VMFA-225 "The Vikings"',
      description:
        'Jack served with distinction in Vietnam as a Marine with VMFA-225 "The Vikings." The experience shaped his character and deepened his understanding of sacrifice, brotherhood, and the weight of duty carried across oceans.',
      icon: '\u{1FA96}',
    },
    {
      id: 'russia',
      title: 'The Russian Chapter',
      location: 'Russia',
      period: 'Post-Soviet Era',
      description:
        'Witnessing a nation reinvent itself in real time, Pat and Jack immersed themselves in Russian culture during one of the most transformative periods in modern history. From Moscow to the provinces, they built friendships that transcend borders.',
      icon: '\u{1F3DB}\uFE0F',
    },
    {
      id: 'south-korea',
      title: 'South Korea',
      location: 'South Korea',
      period: 'Cultural Immersion',
      description:
        'The vibrant energy of South Korea captivated them both. From ancient temples to neon-lit cities, they discovered a nation where tradition and modernity dance in perfect harmony.',
      icon: '\u{1F3EF}',
    },
    {
      id: 'poland',
      title: 'Poland',
      location: 'Poland',
      period: 'European Adventures',
      description:
        'In Poland they found resilience written in stone and spirit. Historic cities, warm hospitality, and a culture that refuses to forget its past while building toward an extraordinary future.',
      icon: '\u{1F3F0}',
    },
    {
      id: 'india',
      title: 'India',
      location: 'India',
      period: 'Spiritual Discovery',
      description:
        'India overwhelmed the senses and nourished the soul. Every corner offered a lesson in patience, beauty, and the infinite variations of human expression. A place that changed them forever.',
      icon: '\u{1F54C}',
    },
    {
      id: 'cruises',
      title: 'On the Water',
      location: 'Worldwide',
      period: 'A Lifetime of Voyages',
      description:
        'The open sea has always called to Pat and Jack. Boat cruises became their way of threading the world together, watching coastlines emerge from morning mist and sunsets paint new ports in gold.',
      icon: '\u{1F6F3}\uFE0F',
    },
  ],

  pat: {
    education: 'UT Arlington, Bachelor of Architecture',
    passions: [
      'Architecture and design',
      'Cultural preservation',
      'World travel and exploration',
    ],
  },

  jack: {
    service: 'United States Marine Corps',
    unit: 'VMFA-225 "The Vikings"',
    theater: 'Vietnam',
    passions: [
      'Military history',
      'Cultural tourism',
      'Ocean voyages',
    ],
  },

  audioTracks: {
    home: {
      label: 'Moon River (Symphonic)',
      // Placeholder: replace with licensed or original symphonic Moon River
      // Using royalty-free ambient as fallback
      url: '/audio/moonriver-syphonic.mp3',
      fallbackUrl: 'https://cdn.pixabay.com/audio/2024/11/04/audio_a2dce20968.mp3',
    },
    ambient: [
      {
        label: 'Temple Bells',
        url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_df6421ffd0.mp3',
      },
      {
        label: 'Zen Garden',
        url: 'https://cdn.pixabay.com/audio/2024/09/11/audio_f9d53e52b9.mp3',
      },
      {
        label: 'Ocean Waves',
        url: 'https://cdn.pixabay.com/audio/2024/06/05/audio_9ab2e8843f.mp3',
      },
    ],
  },
}
