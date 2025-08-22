import { IconUserPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useTipologias } from '../context/tipologias-context'

export function TipologiasPrimaryButtons() {
  const { setOpen } = useTipologias()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Cadastrar Tipologia</span> <IconUserPlus size={18} />
      </Button>
    </div>
  )
}
