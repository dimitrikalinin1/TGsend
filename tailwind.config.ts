
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '0.75rem',
				xs: '0.5rem',
				sm: '1rem',
				md: '1.25rem',
				lg: '1.5rem',
				xl: '2rem',
				'2xl': '2rem',
			},
			screens: {
				xs: '475px',
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px'
			}
		},
		screens: {
			'2xs': '320px',
			'xs': '375px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
				mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// iOS-style colors
				ios: {
					blue: '#007AFF',
					indigo: '#5856D6',
					purple: '#AF52DE',
					pink: '#FF2D92',
					red: '#FF3B30',
					orange: '#FF9500',
					yellow: '#FFCC00',
					green: '#34C759',
					teal: '#5AC8FA',
					cyan: '#50E3C2',
					gray: {
						50: '#F2F2F7',
						100: '#E5E5EA',
						200: '#D1D1D6',
						300: '#C7C7CC',
						400: '#AEAEB2',
						500: '#8E8E93',
						600: '#636366',
						700: '#48484A',
						800: '#3A3A3C',
						900: '#1C1C1E'
					}
				},
				telegram: {
					50: '#EBF4FF',
					100: '#D1E7FF',
					200: '#AED6FF',
					300: '#85C1FF',
					400: '#5FACFF',
					500: '#2196F3',
					600: '#1976D2',
					700: '#1565C0',
					800: '#0D47A1',
					900: '#0A3D62'
				},
				instagram: {
					50: '#FDF2F8',
					100: '#FCE7F3',
					200: '#FBCFE8',
					300: '#F9A8D4',
					400: '#F472B6',
					500: '#E91E63',
					600: '#D81B60',
					700: '#C2185B',
					800: '#AD1457',
					900: '#880E4F'
				},
				glass: {
					light: 'rgba(255, 255, 255, 0.15)',
					medium: 'rgba(255, 255, 255, 0.25)',
					dark: 'rgba(0, 0, 0, 0.15)',
					telegram: 'rgba(33, 150, 243, 0.15)',
					instagram: 'rgba(233, 30, 99, 0.15)',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'slide-in-right': {
					'0%': {
						transform: 'translateX(100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				},
				'pulse-soft': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.8'
					}
				},
				'glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
					},
					'50%': {
						boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)',
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)',
					},
					'50%': {
						transform: 'translateY(-10px)',
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-200% 0',
					},
					'100%': {
						backgroundPosition: '200% 0',
					}
				},
				'bounce-gentle': {
					'0%, 100%': {
						transform: 'translateY(0)',
						animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
					},
					'50%': {
						transform: 'translateY(-5%)',
						animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
					}
				},
				'slide-up': {
					'0%': {
						transform: 'translateY(20px)',
						opacity: '0',
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1',
					}
				},
				'slide-down': {
					'0%': {
						transform: 'translateY(-20px)',
						opacity: '0',
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1',
					}
				},
				'blur-in': {
					'0%': {
						filter: 'blur(8px)',
						opacity: '0',
					},
					'100%': {
						filter: 'blur(0px)',
						opacity: '1',
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
				'scale-in': 'scale-in 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
				'slide-in-right': 'slide-in-right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'bounce-gentle': 'bounce-gentle 2s infinite',
				'slide-up': 'slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
				'slide-down': 'slide-down 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
				'blur-in': 'blur-in 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
			},
			backdropBlur: {
				xs: '2px',
				sm: '4px',
				md: '8px',
				lg: '12px',
				xl: '16px',
				'2xl': '24px',
				'3xl': '32px',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'shimmer': 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.5) 50%, transparent 75%)',
			},
			fontSize: {
				'2xs': ['0.625rem', { lineHeight: '0.75rem' }],
				'3xs': ['0.5rem', { lineHeight: '0.625rem' }],
			},
			spacing: {
				'0.5': '0.125rem',
				'1.5': '0.375rem',
				'2.5': '0.625rem',
				'3.5': '0.875rem',
				'4.5': '1.125rem',
				'5.5': '1.375rem',
				'18': '4.5rem',
				'88': '22rem',
			},
			minHeight: {
				'screen-safe': ['100vh', '100dvh'],
				'touch': '44px',
				'button': '36px',
				'button-sm': '32px',
				'button-lg': '48px',
			},
			maxWidth: {
				'8xl': '88rem',
				'9xl': '96rem',
				'screen': '100vw',
				'safe': 'calc(100vw - 1rem)',
			},
			width: {
				'screen': '100vw',
				'safe': 'calc(100vw - 1rem)',
			},
			padding: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
			margin: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
