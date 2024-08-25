import Image from 'next/image';
import spinner from '../public/assets/icons/loader.svg'

interface SubmitButtonI {
    loading: boolean;
    className?: string;
    children: React.ReactNode;
  
}

const SubmitButton = ({loading, className, children}: SubmitButtonI) => {
  return (
   <button
   type='submit'
   disabled={loading}
   className={`text-sm font-medium tracking-w-normal text-white transition duration-200 ease-in-out ${className}`}
   >
    {loading ? (
        <div className='flex items-center gap-3'>
            <Image
            src={spinner}
            alt='loader'
            width={24}
            height={24}
            className='animate-spin'
            />
        </div>
    ) : children}
   </button>
  )
}

export default SubmitButton