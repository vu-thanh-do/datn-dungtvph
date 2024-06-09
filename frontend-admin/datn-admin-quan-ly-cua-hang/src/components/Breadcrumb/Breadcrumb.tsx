import { Link } from 'react-router-dom'

interface BreadcrumbProps {
  pageName: string
  children?: React.ReactNode
}
const Breadcrumb = ({ pageName, children }: BreadcrumbProps) => {
  return (
    <div className='mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
      <nav>
        <ol className='flex items-center gap-2'>
          <li>
            <Link to='/dashboard'>Dashboard /</Link>
          </li>
          <li className='text-primary'>{pageName}</li>
        </ol>
      </nav>
      <>{children ? children : <div className=''></div>}</>
    </div>
  )
}

export default Breadcrumb
