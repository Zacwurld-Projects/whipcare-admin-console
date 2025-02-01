import { fetchServiceBookingDetails } from '@/app/api/apiClient';
import { useGlobalContext } from '@/app/context/AppContext';
import { useMutation } from '@tanstack/react-query';

const useGetBookingDetails = () => {
  const { bookingDetails, setBookingDetails } = useGlobalContext();

  const GetBookingDetails = useMutation({
    mutationKey: ['fetchBookingDetails'],
    mutationFn: ({ id }: { id: string }) => fetchServiceBookingDetails(id),
    onSuccess: (data) =>
      setBookingDetails({
        ...bookingDetails,
        isLoading: false,
        data: data.booking,
      }),
    onError: () =>
      setBookingDetails({
        ...bookingDetails,
        isLoading: false,
      }),
  });

  const openBookingDetailsModal = (id: string) => {
    setBookingDetails({
      ...bookingDetails,
      display: true,
      heading: 'Service booking list',
      isLoading: true,
    });
    GetBookingDetails.mutate({ id });
  };

  return { openBookingDetailsModal };
};
export default useGetBookingDetails;
