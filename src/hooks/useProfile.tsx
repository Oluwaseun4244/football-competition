import { useGetQuery } from '../utils/apiUtils';

type UserProfile = {
  id: number;
  full_name: string;
  email: string;
  type: string;
  user_name: number;
  team_id: string;
}
export default function useProfile() {


  // const token = localStorage.getItem('token');


  const userProfileQuery = useGetQuery<UserProfile>(
    {
      url: `profile`,
      queryKeys: [`user-profile`],
    },
    {
      queryKey: [`user-profile`],
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
