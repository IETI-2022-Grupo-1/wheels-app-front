import React, { useState } from 'react';

// SCSS colors
import colors from '../scss/utils/_variables.scss';

// Components
import { PageTitle, FormField, OutlinedButton, FilledButton, Modal, Loader } from '../components';
import { AiFillCloseCircle } from 'react-icons/ai';

// Hooks
import { useSignUp } from '../utils';

// Redux
import { useSelector } from 'react-redux';

const SignUp = () => {
  const { post } = useHttp();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // MODALS
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVehicleModal, setIsVehicleModal] = useState(false);
    const [isDriver, setIsDriver] = useState(false);

    // PASSENGER
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('CITY TDB');
    const [organization, setOrganization] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('PHOTO TBD');

    // VEHICLE
    const [idUser, setIdUser] = useState('');
    const [soat, setSoat] = useState('SOAT TBD');
    const [seats, setSeats] = useState('');
    const [propertyCard, setPropertyCard] = useState('PROPERTY CARD TBD');
    const [vehicleDescription, setVehicleDescription] = useState('');
    const [carPhoto, setCarPhoto] = useState('PHOTO TBD');
    const [isActive, setIsActive] = useState(true);

    const resetComponent = () => {
        // MODALS
        setIsModalOpen(false);
        setIsVehicleModal(false);
        setIsDriver(false);

        // PASSENGER
        setName('');
        setLastname('');
        setEmail('');
        setPassword('');
        setPhone('');
        setCity('CITY TDB');
        setOrganization('');
        setProfilePhoto('PHOTO TBD');

        // VEHICLE
        setIdUser('');
        setSoat('SOAT TBD');
        setSeats('');
        setPropertyCard('PROPERTY CARD TBD');
        setVehicleDescription('');
        setCarPhoto('CAR PHOTO TBD');
        setIsActive(true);
    };

    // MODAL
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenVehicleModal = () => {
        setIsVehicleModal(true);
    };

    const handleCloseVehicleModal = () => {
        setIsVehicleModal(false);
    };

    // FORM PASSENGER
    const handleNameChange = (event) => {
        event.preventDefault();
        setName(event.target.value);
    };

    const handleLastnameChange = (event) => {
        event.preventDefault();
        setLastname(event.target.value);
    };

    const handlePhoneChange = (event) => {
        event.preventDefault();
        setPhone(event.target.value);
    };

    const handleCityChange = (event) => {
        event.preventDefault();
        setCity(event.target.value);
    };

    const handleOrganizationChange = (event) => {
        event.preventDefault();
        setOrganization(event.target.value);
    };

    const handleEmailChange = (event) => {
        event.preventDefault();
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        event.preventDefault();
        setPassword(event.target.value);
    };

    // FORM VEHICLE
    const handleSeatsChange = (event) => {
        event.preventDefault();
        setSeats(event.target.value);
    };

    const handleVehicleDescriptionChange = (event) => {
        event.preventDefault();
        setVehicleDescription(event.target.value);
    };

    // HANDLERS
    const handleDriverButtonClick = async (event) => {
        event.preventDefault();

        handleOpenModal();
        setIsDriver(true);
    };

    const handlePassengerButtonClick = async (event) => {
        event.preventDefault();

        handleOpenModal();
        setIsDriver(false);
    };

    const handleRegisterPassengerButtonClick = async (event) => {
        event.preventDefault();
        dispatch(startLoading());

        let userId = null;
        const url = `${process.env.REACT_APP_BACKEND_URL}/users`;
        const data = {
            name,
            lastName: lastname,
            email,
            password,
            phoneNumber: phone,
            city,
            organization,
            profilePhoto
        };

        try {
            const userData = await post(url, data);
            const message = userData?.message;
            userId = userData?.id;

            if (message) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal',
                    footer: `<p>${message}<p/>`
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            dispatch(stopLoading());
        }

        resetComponent();

        if (userId) {
            Swal.fire({
                icon: 'success',
                title: 'Registro éxitoso',
                text: '¡Bienvenido a Wheelsapp!'
            });
            navigate(UserRoutes.login.path);
        }
    };

    const handleRegisterDriverButtonClick = async (event) => {
        event.preventDefault();
        dispatch(startLoading());

        let userId = null;
        let token = null;
        let vehicleId = null;

        // REGISTER USER
        const userUrl = `${process.env.REACT_APP_BACKEND_URL}/users`;
        const driverData = {
            name,
            lastName: lastname,
            email,
            password,
            phoneNumber: phone,
            city,
            organization,
            profilePhoto
        };

        try {
            const userData = await post(userUrl, driverData);
            const message = userData?.message;
            userId = userData?.id;

            if (message) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal',
                    footer: `<p>${message}<p/>`
                });
            }
        } catch (err) {
            console.error(err);
            return;
        } finally {
            dispatch(stopLoading());
        }

        // LOGIN USER
        const loginUrl = `${process.env.REACT_APP_BACKEND_URL}/auth`;
        const loginData = {
            email,
            password
        };

        try {
            const loginInfo = await post(loginUrl, loginData);
            token = loginInfo?.token;

            console.log(token);

        } catch (err) {
            console.error(err);
        } finally {
            dispatch(stopLoading());
        }

        // REGISTER VEHICLE
        const vehicleUrl = `${process.env.REACT_APP_BACKEND_URL}/vehicles`;
        const vehicleData = {
            idUser: userId,
            soat,
            seats,
            propertyCard,
            vehicleDescription,
            carPhoto,
            isActive,
        };

        try {
            const vehicleInfo = await post(vehicleUrl, vehicleData, token);
            const message = vehicleInfo?.message;
            vehicleId = vehicleInfo?.id;

            if (message) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal',
                    footer: `<p>${message}<p/>`
                });
            }
        } catch (err) {
            console.error(err);
            return;
        } finally {
            dispatch(stopLoading());
        }

        resetComponent();

        Swal.fire({
            icon: 'success',
            title: 'Registro éxitoso',
            text: '¡Bienvenido a Wheelsapp!'
        });
        navigate(UserRoutes.login.path);

    };

    const handleDriverContinueClick = (event) => {
        event.preventDefault();
        handleCloseModal();
        handleOpenVehicleModal();
    };

    const handleLoginHereClick = (event) => {
        event.preventDefault();
        navigate(UserRoutes.login.path);
    };

    return {
        handleEmailChange,
        handlePasswordChange,
        handleRegisterDriverButtonClick,
        handleRegisterPassengerButtonClick,
        handleLoginHereClick,
        handleOpenModal,
        handleCloseModal,
        isModalOpen,
        handleNameChange,
        handleLastnameChange,
        handlePhoneChange,
        handleCityChange,
        handleOrganizationChange,
        isDriver,
        handleDriverContinueClick,
        isVehicleModal,
        handleCloseVehicleModal,
        handleDriverButtonClick,
        handlePassengerButtonClick,
        handleSeatsChange,
        handleVehicleDescriptionChange,
        name,
        lastname,
        email,
        password,
        phone,
        city,
        organization,
        profilePhoto,
        idUser,
        soat,
        seats,
        propertyCard,
        vehicleDescription,
        carPhoto,
        isActive,
    };

  const isLoading = useSelector((state) => state.common.isLoading);

  const dummyUniversities = [
    {
      name: 'Escuela Colombiana de Ingeniería',
      value: '631feea0ae8ca16cd15a5b12'
    }
  ];

  const [universities, setUniversities] = useState(dummyUniversities);


  return (
    <>
      {isLoading && <Loader />}
      <div className='signUp'>
        <div className='signUp__background'>
          <div className='signUp__container'>
            <div className='signUp__content'>
              <PageTitle title={'Regístrate para ingresar '} borderColor={colors?.lightPink} />
              <form className='signUp__form'>
                <FormField label='Nombre de Usuario' helper='Escribe tu correo institucional' changeHandler={handleEmailChange} value={email} />
                <FormField label='Contraseña' type='password' changeHandler={handlePasswordChange} value={password} />

                <FormField label='Universidad'>
                  <select name='' id='' defaultValue={'Seleccione una opción'} onChange={handleOrganizationChange}>
                    <option value=''>Seleccione una opción</option>
                    {universities.map((university, idx) =>
                      <option key={idx} value={university.value}>{university.name}</option>
                    )}
                  </select>
                </FormField>

              </form>
              <hr className='signUp__section-divider' />
              <div className='signUp__cta-list'>
                <OutlinedButton text='Registrar como conductor' color={colors.darkMustard} clickHandler={handleDriverButtonClick} />
                <OutlinedButton text='Registrar como pasajero' color='#dAdAdA' clickHandler={handlePassengerButtonClick} />
              </div>

              <div className='signUp__footer'>
                <p className='signUp__footer--text'>¿Ya estás registrado en Wheels?</p>
                <a className='signUp__footer--link' onClick={handleLoginHereClick}>Ingresa aquí</a>
              </div>
            </div>
          </div>
        </div>

        {/* Passenger modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          contentLabel='Example Modal'>

          <div className='signUp__content--modal'>
            <form className='signUp__form--modal'>
              <AiFillCloseCircle className='signUp__form--modal__close' onClick={handleCloseModal} />

              <FormField label='Nombre' type='text' changeHandler={handleNameChange} value={name} />
              <FormField label='Apellido' type='text' changeHandler={handleLastnameChange} value={lastname} />
              <FormField label='Teléfono' type='number' changeHandler={handlePhoneChange} value={phone} />
            </form>

            <hr className='signUp__section-divider' />
            <div className='signUp__cta-list'>
              {isDriver ?
                <FilledButton text='Continuar' color={colors?.lightPink} clickHandler={handleDriverContinueClick} />
                :
                <FilledButton text='Registrar como pasajero' color={colors?.lightPink} clickHandler={handleRegisterPassengerButtonClick} />}
            </div>
          </div>
        </Modal>

        {/* Vehicle modal */}
        <Modal
          isOpen={isVehicleModal}
          onRequestClose={handleCloseVehicleModal}
          contentLabel='Example Modal'>

          <div className='signUp__content--modal'>
            <form className='signUp__form--modal'>
              <AiFillCloseCircle className='signUp__form--modal__close' onClick={handleCloseVehicleModal} />

              <FormField label='Total de asientos disponibles' helper='¿Cuántas personas puedes llevar?' type='number' changeHandler={handleSeatsChange} value={seats} />
              <FormField label='Descripción del vehículo' helper='Nissan March Azul' type='text' changeHandler={handleVehicleDescriptionChange} value={vehicleDescription} />
            </form>

            <hr className='signUp__section-divider' />
            <div className='signUp__cta-list'>
              <FilledButton text='Registrar conductor' color={colors?.lightPink} clickHandler={handleRegisterDriverButtonClick} />
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default SignUp;
