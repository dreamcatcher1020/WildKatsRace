import Loading from '/assets/image/loading.svg'
import Image from 'next/image'

const Loader = () => {
  return (
    <div className="flex justify-center mt-32">
      <Image alt="Loading" src={Loading} />
    </div>
  )
}

export default Loader
