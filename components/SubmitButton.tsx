import Image from "next/image";
import spinner from "../public/assets/icons/loader.svg";

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

const SubmitButton = ({
  loading,
  className,
  children,
  disabled,
  ...props // 👈 capturamos todos los props extra (como data-testid)
}: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`text-sm font-medium tracking-w-normal text-black transition duration-200 ease-in-out ${className}`}
      {...props} // 👈 los pasamos al <button>
    >
      {loading ? (
        <div className="flex items-center justify-start pl-3 gap-3">
          <Image
            src={spinner}
            alt="loader"
            width={24}
            height={24}
            className="animate-spin flex items-center justify-center"
          />
          <p className="text-sm font-medium italic tracking-w-normal text-black flex items-center justify-center">
            Aguarde un momento por favor...
          </p>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default SubmitButton;
