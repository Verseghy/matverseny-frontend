import { Accessor, createEffect, createSignal } from 'solid-js'

export type PaginatedItem<T> = [T, number]

export type Paginator<T> = {
  (): PaginatedItem<T>[];
  current: Accessor<number>,
  last: Accessor<number>,
  next: () => void;
  prev: () => void;
}

export const usePaginate = <T>(array: Accessor<T[]>, pageSize: number): Paginator<T> => {
  const [currentPage, setCurrentPage] = createSignal(0)
  const [sliced, setSliced] = createSignal<PaginatedItem<T>[]>([])

  const lastPage = (): number => {
    return Math.ceil(array().length / pageSize) - 1
  }
  
  createEffect(() => {
    const sliced = array()
      .slice(currentPage() * pageSize, (currentPage() + 1) * pageSize)
      .map((element, index) => [element, index + currentPage() * pageSize] as PaginatedItem<T>)

    setSliced(sliced)
  })

  Object.defineProperties(sliced, {
    current: { get: () => currentPage() },
    last: { get: () => lastPage() },
    next: {
      get: () => () => {
        setCurrentPage((prev) => prev === lastPage() ? lastPage() : prev + 1)
      },
    },
    prev: {
      get: () => () => {
        setCurrentPage((prev) => prev === 0 ? 0 : prev - 1)
      },
    },
  })

  return sliced as Paginator<T>
}
