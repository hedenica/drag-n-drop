import styles from './button.module.scss'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

export const Button = ({ title, ...rest }: ButtonProps) => {
  return (
    <button className={styles.button} {...rest}>
      {title}
    </button>
  )
}
