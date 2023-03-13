import { createContext, FlowComponent } from 'solid-js'

export const PaginatorContext = createContext(0)

const Paginator: FlowComponent = (props) => {
  return (
    <PaginatorContext.Provider value={0}>
      {props.children}
    </PaginatorContext.Provider>
  )
}

export default Paginator
