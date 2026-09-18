import { ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => {
    const baseStyles = 
      'px-6 py-3 font-sans font-semibold transition-all duration-150 ' +
      'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-electric-blue ' +
      'disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variantStyles = {
      primary: 
        'bg-pink-hot text-cream border-2 border-pink-hot ' +
        'shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] ' +
        'hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] ' +
        'active:shadow-none active:translate-x-[4px] active:translate-y-[4px]',
      secondary: 
        'bg-transparent text-lavender border-2 border-lavender ' +
        'hover:bg-lavender hover:bg-opacity-10 ' +
        'active:bg-lavender active:bg-opacity-20'
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
