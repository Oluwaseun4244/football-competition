import { useGetQuery } from '../utils/apiUtils';

export default function useProfile() {


  const user = JSON.parse(localStorage.getItem('user') || '{}');


  const userProfileQuery = useGetQuery<any>(
    {
      url: `profile/${user?.id}`,
      queryKeys: [`user-profile-${user?.id}`],
    },
    {
      queryKey: [`user-profile-${user?.id}`],
      refetchOnWindowFocus: false,
      retry: 2
    }
  );

  const userProfile = userProfileQuery.data;

  return {
    userProfileQuery,
    userProfile
  }
}
