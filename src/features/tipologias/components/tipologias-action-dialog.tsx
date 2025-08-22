'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tipologia } from '../data/schema'
import {
  useCreateTipologiaAuto,
  useUpdateTipologiaAuto,
} from '../hooks/use-tipologias-auto'

const formSchema = z.object({
  identificacao: z
    .string()
    .min(1, { message: t('Identificação is required.') }),
  descricao: z.string().min(1, { message: t('Descrição is required.') }),
  isEdit: z.boolean(),
})
type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: Tipologia
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const { t } = useTranslation()
  const isEdit = !!currentRow

  // Hooks devem ser chamados no nível superior do componente
  const createTipologia = useCreateTipologiaAuto()
  const updateTipologia = useUpdateTipologiaAuto()

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          isEdit,
        }
      : {
          identificacao: '',
          descricao: '',
          isEdit,
        },
  })

  const onSubmit = (values: UserForm) => {
    // Agora usamos as instâncias dos hooks que foram criadas no nível superior
    if (isEdit) {
      updateTipologia.mutate(
        {
          id: currentRow!.id,
          identificacao: values.identificacao,
          descricao: values.descricao,
        },
        {
          onSuccess: () => {
            form.reset()
            onOpenChange(false)
          },
        }
      )
    } else {
      createTipologia.mutate(
        {
          identificacao: values.identificacao,
          descricao: values.descricao,
        },
        {
          onSuccess: () => {
            form.reset()
            onOpenChange(false)
          },
        }
      )
    }
  }

  // Estado de loading para desabilitar o botão durante a submissão
  const isLoading = createTipologia.isPending || updateTipologia.isPending

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {isEdit ? 'Editar Tipologia' : 'Adicionar Nova Tipologia'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize a tipologia aqui. '
              : 'Crie uma nova tipologia aqui. '}
            Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='-mr-4 h-[26.25rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='identificacao'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Identificação
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Identificação da tipologia'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='descricao'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Descrição
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Descrição da tipologia'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button type='submit' form='user-form' disabled={isLoading}>
            {isLoading
              ? isEdit
                ? 'Salvando...'
                : 'Criando...'
              : t('Save changes')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
