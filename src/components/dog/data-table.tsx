'use client';
import { useMemo } from 'react';
import {
  ActionIcon,
  Anchor,
  Container,
  Flex,
  Badge,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import {
  MantineReactTable,
  useMantineReactTable,
  MRT_Row,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ModalsProvider, modals } from '@mantine/modals';
import camelcaseKeys from 'camelcase-keys';

import useAxiosAuth from '@/hooks/useAxiosAuth';
import { ApiResponse } from '@/types';
import { Dog } from '@/lib/schemas';
import { Icons } from '../icons';
import { titleCase } from '@/lib/utils';
import { Link } from '@/lib/router-events';
import { notifications } from '@mantine/notifications';
import { AxiosInstance, isAxiosError } from 'axios';

function useGetDogs(axiosAuth: AxiosInstance) {
  return useQuery<Dog[]>({
    queryKey: ['dogs'], //refetch whenever the URL changes (columnFilters, globalFilter, sorting, pagination)
    queryFn: () =>
      axiosAuth.get<ApiResponse<Dog[]>>('/shelters/pets/me').then((res) => {
        const dogs = res.data.data.map((dog) => camelcaseKeys(dog));
        return dogs;
      }),
    throwOnError: true,
  });
}

function useDeleteDog(axiosAuth: AxiosInstance) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dogId: number = -1) => {
      try {
        await axiosAuth.delete(`/shelters/pets/${dogId}`);
        notifications.show({
          title: `Success`,
          message: 'Data deleted successfully.',
          color: 'green',
        });
      } catch (error) {
        if (isAxiosError(error)) {
          notifications.show({
            title: `Oops!`,
            message: error.message,
            color: 'red',
          });
        }
      }
      return Promise.resolve();
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['dogs'] }),
  });
}

export function DataTable() {
  const axiosAuth = useAxiosAuth();
  const columns = useMemo<MRT_ColumnDef<Dog>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 96,
        Cell: ({ cell, row }) => (
          <Anchor
            component={Link}
            c="blue"
            size="sm"
            underline="always"
            href={`/dogs/${row.original.id}`}
          >
            {cell.getValue<string>()}
          </Anchor>
        ),
      },
      {
        accessorKey: 'breed',
        header: 'Breed',
        size: 128,
        Cell: ({ cell }) => titleCase(cell.getValue<string>()),
      },
      {
        accessorKey: 'gender',
        header: 'Sex',
        size: 64,
        Cell: ({ cell }) => {
          const val = cell.getValue<string>();
          return (
            <Badge
              variant="outline"
              size="lg"
              color={val === 'MALE' ? 'blue' : 'red'}
            >
              {val}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'estimateAge',
        header: 'Age',
        size: 64,
        Cell: ({ cell }) => `${cell.getValue<string>()} y.o.`,
      },
      {
        accessorKey: 'sterilizationStatus',
        header: 'Sterilization Status',
        size: 128,
        Cell: ({ cell }) => (
          <Badge variant="default" size="lg">
            {titleCase(cell.getValue<string>())}
          </Badge>
        ),
      },
    ],
    []
  );

  const openDeleteConfirmModal = (row: MRT_Row<Dog>) =>
    modals.openConfirmModal({
      title: 'Delete',
      children: (
        <Text>
          Are you sure you want to delete {row.original.name}? This action
          cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      centered: true,
      onConfirm: () => deleteDog(row.original.id),
    });

  const {
    data: fetchedDogs = [],
    isError: isLoadingDogsError,
    isFetching: isFetchingDogs,
    isLoading: isLoadingDogs,
  } = useGetDogs(axiosAuth);
  const { mutateAsync: deleteDog, isPending: isDeletingDog } =
    useDeleteDog(axiosAuth);

  const table = useMantineReactTable({
    columns,
    data: fetchedDogs,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnActions: false,
    enableSorting: false,
    editDisplayMode: 'custom',
    mantinePaperProps: {
      style: {
        '--paper-shadow': 'none',
        position: 'relative',
        zIndex: 1,
        overflowX: 'auto',
      },
    },
    mantineTableProps: {
      style: {
        tableLayout: 'fixed',
      },
    },
    mantineTableHeadCellProps: {
      p: '1rem',
    },
    mantineSkeletonProps: {
      width: '64',
    },
    state: {
      isLoading: isLoadingDogs,
      showLoadingOverlay: isDeletingDog || isFetchingDogs,
      showAlertBanner: isLoadingDogsError,
      showProgressBars: isFetchingDogs,
    },
    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActions: ({ row }) => (
      <Flex gap="sm">
        <Tooltip label="Edit">
          <ActionIcon
            href={`/dogs/${row.original.id}/edit`}
            component={Link}
            variant="outline"
          >
            <Icons.pencil size="1rem" />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon
            variant="outline"
            color="red"
            onClick={() => openDeleteConfirmModal(row)}
          >
            <Icons.trash size="1rem" />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    renderEmptyRowsFallback: () => (
      <Container ta="center" py="md">
        <ThemeIcon radius="xl" size="xl" color="gray">
          <Icons.paw />
        </ThemeIcon>
        <Text mt="md">You haven&apos;t added any dog data yet.</Text>
      </Container>
    ),
  });
  return <MantineReactTable table={table} />;
}

export default function DogTable() {
  return (
    <ModalsProvider>
      <DataTable />
    </ModalsProvider>
  );
}
