import { useMutation } from 'react-query';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { axios } from '@/lib/axios';
import { Marker } from '../types';

export type CreateMarkerDTO = {
    marker: {
        name: string;
        description: string;
        latitude: number;
        longitude: number;
        address: string;
    },
};

export const createMarker = ({ marker }: CreateMarkerDTO): Promise<Marker> => {
    return axios.post(`/v1/markers`, {
        marker: marker,
    }).then((res) => res.data.marker);
};

type UseCreateMarkerOptions = {
    config?: MutationConfig<typeof createMarker>;
};

export const useCreateMarker = ({ config }: UseCreateMarkerOptions = {}) => {
    return useMutation({
        onMutate: async (newMarker) => {
            await queryClient.cancelQueries('markers');

            const previousMarkers = queryClient.getQueryData<Marker[]>('markers');

            queryClient.setQueryData('markers', [...(previousMarkers || []), newMarker.marker]);

            return { previousMarkers };
        },
        onError: (_, __, context: any) => {
            if (context?.previousMarkers) {
                queryClient.setQueryData('markers', context.previousMarkers);
            }
            alert('作成に失敗しました。');
        },
        onSuccess: () => {
            queryClient.invalidateQueries('markers');
            alert('正常に送信されました。')
        },
        ...config,
        mutationFn: createMarker,
    });
};