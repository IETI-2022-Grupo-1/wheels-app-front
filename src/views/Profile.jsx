import React, { useState, useEffect } from 'react';
import { Header, ProfileHeader, FormField, Loader } from '../components';
import { Layout } from './';
import Swal from 'sweetalert2';
import { useHttp } from '..';
import { useDispatch, useSelector } from 'react-redux';
import {startLoading, stopLoading, setUserData} from '../../redux';


const useProfile = () => {
    const { get } = useHttp();
    const dispatch = useDispatch();
    const { isDriver, userId, token } = useSelector((state) => state.login);

    useEffect(() => {
        const getData = async () => {
            dispatch(startLoading());
            const url = `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`;
            try {
                const userData = await get(url, token);
                const message = userData?.message;
                if (message) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Algo salió mal',
                        footer: `<p>${message}<p/>`
                    });
                }
                dispatch(setUserData(userData));
                console.log(userData);
            } catch (err) {
                console.error(err);
            } finally {
                dispatch(stopLoading());
            }
        };
        getData();
    }, []);
    return {
        isDriver,
    };
};
export default useProfile;

const Profile = () => {
    const {isDriver,} = useProfile();
    const userData = useSelector((state) => state.user.userData);
    const isLoading = useSelector((state) => state.common.isLoading);
    const [isDisabled, setIsDisabled] = useState(true);
    return (
        <>
            {isLoading && <Loader />}
            <Layout>
                <main className='profile profile__container'>
                    <Header text='Perfil' />
                    <div className='profile__content'>
                        <ProfileHeader userName={`${userData.name} ${userData.lastName }`} />
                        <form className='profile__form'>
                            <FormField label='Institución' value={userData.organization || ''} isDisabled={isDisabled} />
                            <FormField label='Correo electrónico' value={userData.email || ''} isDisabled={isDisabled} />
                            <FormField label='Contacto' value={userData.phoneNumber || ''} isDisabled={isDisabled} />
                            {isDriver && <FormField label='Vehículos'>
                                <select name='' id=''>
                                    <option value=''>holi</option>
                                </select>
                            </FormField>}
                        </form>
                    </div>
                </main>
            </Layout>
        </>
    );
};

export default Profile;