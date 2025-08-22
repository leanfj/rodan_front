'use client'

// import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { toast } from '@/hooks/use-toast'
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Tipologia } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Tipologia
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  // const [value, setValue] = useState('')

  const { t } = useTranslation()

  const handleDelete = () => {
    // if (value.trim() !== currentRow.identificacao) return

    onOpenChange(false)
    toast({
      title: t('The following register has been deleted:'),
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>
            {JSON.stringify(currentRow, null, 2)}
          </code>
        </pre>
      ),
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      // disabled={value.trim() !== currentRow.identificacao}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='mr-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('Delete Tipologia')}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {t('Are you sure you want to delete')}{' '}
            <span className='font-bold'>{currentRow.identificacao}</span>?
          </p>

          {/* <Label className='my-2'>
            Identificação:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter identificação to confirm deletion.'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>{t('Warning!')}</AlertTitle>
            <AlertDescription>
              {t('Please be careful, this operation cannot be rolled back.')}
            </AlertDescription>
          </Alert> */}
        </div>
      }
      confirmText={t('Delete')}
      destructive
    />
  )
}
