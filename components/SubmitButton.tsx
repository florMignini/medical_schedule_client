import Image from "next/image";
import spinner from "../public/assets/icons/loader.svg";

interface SubmitButtonI {
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const SubmitButton = ({
  loading,
  className,
  children,
  disabled,
}: SubmitButtonI) => {
  return (
    <button
      type="submit"
      disabled={disabled ? disabled : loading}
      className={`text-sm font-medium tracking-w-normal text-black transition duration-200 ease-in-out ${className}`}
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
            {" "}
            Aguarde un momento por favor ...{" "}
          </p>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default SubmitButton;
