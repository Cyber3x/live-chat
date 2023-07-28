export type TCouldError<TData> =
    | {
          ok: true
          data: TData
      }
    | {
          ok: false
          message: string
          error?: unknown
      }
