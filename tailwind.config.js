import aspectRatio from '@tailwindcss/aspect-ratio'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [aspectRatio],
  safelist: [
    'bg-gray-100',
    'bg-white',
    'text-gray-800',
    'text-gray-600',
    'bg-blue-600',
    'hover:bg-blue-700',
    'text-white',
    'shadow-lg',
    'rounded-md',
    'border-gray-200',
    'border-dashed',
  ]
} 