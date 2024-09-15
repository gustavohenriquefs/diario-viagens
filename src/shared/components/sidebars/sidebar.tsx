import { AirplaneTakeoff } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { travelDiaryToast } from "../../../contexts/message.context";
import { useSidebar } from "../../../contexts/sidebar.context";
import { auth } from "../../../firebase";
import { Setting } from "../../../settings/settings";
import { IcSettings } from "../../icons/ic-settings";
import { Modal } from "../modal/modal";

export const Sidebar = () => {
  const { isSidebarOpen } = useSidebar();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const getUserProfilePictureUrl = (username?: string | null) => {
    const randomPictureUrl = `https://ui-avatars.com/api/?name=${username}&background=random`;
    return auth.currentUser?.photoURL ?? randomPictureUrl;
  }

  const username = auth.currentUser?.email;
  const profilePicture = getUserProfilePictureUrl(username);


  const navigation = [
    {
      link: 'diary-travels',
      name: 'Viagens',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
      </svg>
      ,
    },
    {
      link: 'diary-travels/new',
      name: 'Cadastrar',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
      </svg>
      ,
    },
    // {
    //   link: 'diary-travels/edit',
    //   name: 'Editar',
    //   icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    //     <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    //   </svg>
    //   ,
    // },
  ]

  const handleLogout = async () => {
    const { showToast } = travelDiaryToast();
    try {
      await auth.signOut();
      showToast('Logout realizado com sucesso', 'success');
    } catch (error) {
      showToast('Não foi possível realizar logout', 'error');
    }
  }

  const handleProfile = () => {
    setIsOpenModal(true);
  }

  const handleSettings = () => {
    navigate('/home/change-password');
  }

  const navsFooter = [
    {
      name: 'Settings',
      handleClick: () => handleSettings(),
      icon: <IcSettings />
      ,
    },
    {
      name: 'Logout',
      handleClick: handleLogout,
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
      </svg>
      ,
    }
  ]

  return (
    <nav
      className="fixed top-0 left-0 w-auto z-50 h-full border-r bg-white space-y-8 sm:w-auto">
      <div className="flex flex-col h-full">
        <div className='h-20 flex items-center px-2'>
          {
            <Link to='' className='flex-none mx-auto text-steel-blue-700'>
              <AirplaneTakeoff size={48} />
            </Link>
          }
        </div>
        <div className="flex-1 flex flex-col h-full overflow-auto">
          <ul className="px-4 text-sm font-medium flex-1">
            {
              navigation.map((item) => (
                <li key={item.name}>
                  <Link to={item.link} className="flex items-center gap-x-2 text-gray-600 p-2 rounded-lg  hover:bg-gray-50 active:bg-gray-100 duration-150">
                    <div className="text-gray-500">{item.icon}</div>
                    {isSidebarOpen ? item.name : ''}
                  </Link>
                </li>
              ))
            }
          </ul>
          <div>
            <ul className="px-4 pb-4 text-sm font-medium">
              {
                navsFooter.map((item, idx) => (
                  <li key={idx}>
                    <button onClick={item.handleClick} className="flex items-center gap-x-2 text-gray-600 p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 duration-150">
                      <div className="text-gray-500">{item.icon}</div>
                      {isSidebarOpen ? item.name : ''}
                    </button>
                  </li>
                ))
              }
            </ul>
            <div className={`py-4 ${isSidebarOpen ? 'px-4' : 'px-2'} border-t`}>
              <div className={`flex items-center ${isSidebarOpen ? 'gap-x-4' : ''}`}>
                <button onClick={handleProfile}>
                  <img src={profilePicture} className="w-12 h-12 rounded-full" alt="foto de perfil" />
                </button>

                <div>
                  <span className="block text-gray-700 text-sm font-semibold">
                    {isSidebarOpen ? username : ''}
                  </span>
                  <button
                    className="block mt-px text-gray-600 hover:text-indigo-600 text-xs"
                    onClick={handleProfile}
                  >
                    {isSidebarOpen ? 'View profile' : ''}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div >
      </div>

      <Modal isOpen={isOpenModal} content={<Setting />} onClose={() => setIsOpenModal(false)} />
    </nav>
  );
};