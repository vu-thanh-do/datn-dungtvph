import clsxm from '~/utils/clsxm'
import { useColorMode } from '~/hooks'

interface LoaderProps {
  className?: string
}

const Loader = ({ className }: LoaderProps) => {
  const [colorMode] = useColorMode()
  return (
    <div
      className={clsxm(
        `flex items-center justify-center h-screen ${colorMode === 'dark' ? 'bg-boxdark-2' : 'bg-white'}`,
        className
      )}
    >
      <div className='animate-spin border-primary border-t-transparent w-16 h-16 border-4 border-solid rounded-full'></div>
    </div>
  )
}

export default Loader
