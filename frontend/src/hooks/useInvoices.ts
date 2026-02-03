import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import invoiceService from '../services/invoiceService'
import type { Invoice, InvoiceCreate, InvoiceUpdate } from '../types/invoice'

export const useInvoices = () => {
    return useQuery({
        queryKey: ['invoices'],
        queryFn: () => invoiceService.getInvoices(),
    })
}

export const useInvoice = (id: number) => {
    return useQuery({
        queryKey: ['invoice', id],
        queryFn: () => invoiceService.getInvoice(id),
        enabled: !!id,
    })
}

export const useCreateInvoice = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: InvoiceCreate) => invoiceService.createInvoice(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] })
        },
    })
}

export const useUpdateInvoice = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: InvoiceUpdate }) =>
            invoiceService.updateInvoice(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] })
            queryClient.invalidateQueries({ queryKey: ['invoice', variables.id] })
        },
    })
}

export const useDeleteInvoice = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => invoiceService.deleteInvoice(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] })
        },
    })
}

export const useSendInvoice = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, email }: { id: number; email: string }) =>
            invoiceService.sendInvoice(id, email),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['invoice', variables.id] })
        },
    })
}
