import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBarbers, createBarber, updateBarber, getBarberSchedule, updateBarberSchedule } from '../lib/api'

export const useBarbers = () =>
  useQuery({ queryKey: ['barbers'], queryFn: getBarbers })

export const useCreateBarber = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createBarber,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['barbers'] })
  })
}

export const useUpdateBarber = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => updateBarber(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['barbers'] })
  })
}

export const useBarberSchedule = (id) =>
  useQuery({
    queryKey: ['barber-schedule', id],
    queryFn: () => getBarberSchedule(id),
    enabled: !!id
  })

export const useUpdateBarberSchedule = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, schedule }) => updateBarberSchedule(id, schedule),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: ['barber-schedule', id] })
  })
}
