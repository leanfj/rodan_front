import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Tipologia } from '../data/schema'

type TipologiasDialogType = 'invite' | 'add' | 'edit' | 'delete'

interface TipologiasContextType {
  open: TipologiasDialogType | null
  setOpen: (str: TipologiasDialogType | null) => void
  currentRow: Tipologia | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Tipologia | null>>
}

const TipologiasContext = React.createContext<TipologiasContextType | null>(
  null
)

interface Props {
  children: React.ReactNode
}

export default function TipologiasProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<TipologiasDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Tipologia | null>(null)

  return (
    <TipologiasContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </TipologiasContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTipologias = () => {
  const tipologiasContext = React.useContext(TipologiasContext)

  if (!tipologiasContext) {
    throw new Error('useTipologias has to be used within <TipologiasContext>')
  }

  return tipologiasContext
}
